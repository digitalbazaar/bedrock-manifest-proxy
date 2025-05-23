/*!
 * Copyright (c) 2019-2025 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import {asyncHandler} from '@bedrock/express';
import CachePolicy from 'http-cache-semantics';
import contentType from 'content-type';
import {httpClient} from '@digitalbazaar/http-client';
import {httpsAgent} from '@bedrock/https-agent';
import {LRUCache as LRU} from 'lru-cache';

const {config, util: {BedrockError}} = bedrock;

import './config.js';

let MANIFEST_CACHE;

bedrock.events.on('bedrock.init', () => {
  // init web app manifest cache
  MANIFEST_CACHE = new LRU({
    maxSize: config['manifest-proxy'].manifestCache.size,
    sizeCalculation({response}) {
      const headerLength = JSON.stringify(response.headers).length;
      return headerLength + (response.data ? response.data.length : 0);
    }
  });
});

bedrock.events.on('bedrock-express.configure.routes', app => {
  const {route} = config['manifest-proxy'];

  // proxy to get Web App manifests
  app.get(route, asyncHandler(async (req, res) => {
    const {host} = req.query;
    if(!host) {
      throw new BedrockError(
        'A "host" query parameter must be given.',
        'DataError', {httpStatusCode: 400, public: true});
    }
    const response = await getResponse({host});
    res.status(response.status).set(response.headers).send(response.body);
  }));
});

async function getResponse({host}) {
  /* Note: The caching policy is here is to *always* cache a response for
  `bedrock.config['manifest-proxy'].manifestCache.ttl` and use that response for
  subsequent requests until the expiration time `freshUntil` is hit. To
  be clear, any response will be cached for at least this period of time, even
  if it is a 404 or if HTTP Cache Control policy indicates it should not be
  stored. This is done because this server handles many requests for the same
  document from many clients and, in order to provide responses, this server
  must hit other origin servers.

  After that simple expiration time passes, whether or not the cached response
  is used is then based on HTTP Cache Control policy. */

  // check for response from cache
  const manifestPath = '/manifest.json';
  const manifestUrl = `https://${host}${manifestPath}`;
  let {policy, response, freshUntil} = MANIFEST_CACHE.get(manifestUrl) || {};

  if(policy && Date.now() < freshUntil) {
    // cached response hasn't expired, no need to check policy
    return response;
  }

  if(policy && !policy.storable()) {
    // response not storable per http cache control policy; clear policy
    policy = null;
  }

  // create new request
  const request = {
    url: manifestPath,
    headers: {
      accept: 'application/manifest+json, application/json'
    }
  };

  // TODO: maybe skip revalidation for our use case and just don't update
  // 5 minute time out? ... or something! ... we don't want to do a 304
  // all the time for lots of different clients, only every 5 minutes or so

  if(policy && policy.satisfiesWithoutRevalidation(request)) {
    // cached response is reusable, send it
    response.headers = policy.responseHeaders();
    return response;
  }

  if(policy) {
    // ask origin server if cached response can be used
    request.headers = policy.revalidatedPolicy(request, response);
  }

  // response not cached yet or not reusable, fetch again
  const newResponse = await getManifest({manifestUrl, request});

  if(policy) {
    // update policy
    const result = policy.revalidatedPolicy(request, response);
    policy = result.policy;
    response = result.modified ? newResponse : response;
  } else {
    // create policy
    response = newResponse;
    policy = new CachePolicy(request, response);
  }

  // even if HTTP cache headers say not to cache, we cache for a short time
  const ttl = policy.storable() ?
    policy.timeToLive() : config['manifest-proxy'].manifestCache.ttl;

  // update cache
  freshUntil = Date.now() + config['manifest-proxy'].manifestCache.ttl;
  MANIFEST_CACHE.set(manifestUrl, {policy, response, freshUntil}, {ttl});

  // update response header using latest policy
  response.headers = policy.responseHeaders();
  return response;
}

async function getManifest({manifestUrl, request}) {
  // fetch web app manifest from server
  const {headers} = request;
  let response;
  try {
    // use a short timeout to help prevent DoS
    response = await httpClient.get(manifestUrl, {
      headers,
      agent: httpsAgent,
      timeout: config['manifest-proxy'].manifestCache.requestTimeout
    });
    response = {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: response.data
    };
  } catch(e) {
    if(e.response) {
      response = e.response;
      response = {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: response.data
      };
    } else {
      // transform to a 404
      response = {
        status: 404,
        headers: {},
        data: null
      };
    }
  }

  if(response.status >= 400) {
    // do not store any response body for errors
    response.headers = {};
    response.data = null;
  }

  // TODO: may need to do something similar for other status codes as well
  if(response.status === 200 && !_isContentJson(response)) {
    // transform to 404 to avoid storing spurious response
    response = {
      status: 404,
      headers: {},
      data: null
    };
  }

  // return sanitized response
  return {
    status: response.status,
    headers: response.headers,
    body: response.data
  };
}

function _isContentJson(response) {
  const {type} = contentType.parse(response);
  return ['application/manifest+json', 'application/json'].includes(type);
}
