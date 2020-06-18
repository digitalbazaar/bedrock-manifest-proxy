/*
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {ManifestClient} = require('@digitalbazaar/web-app-manifest-utils');
const brHttpsAgent = require('bedrock-https-agent');

describe(`Manifest Client`, () => {
  describe(`'/manifest.json' Tests`, () => {
    it(`success response'`,
      async () => {
        const baseUrl = 'http://wallet.interop.digitalbazaar.com/';
        const {httpsAgent} = brHttpsAgent;
        const manifestClient = new ManifestClient({
          baseUrl,
          httpsAgent,
        });

        let result;
        let err;
        try {
          result = await manifestClient.getManifest();
        } catch(e) {
          err = e;
        }
        console.log(err);
        console.log(result);
      }
    );
  });
});
