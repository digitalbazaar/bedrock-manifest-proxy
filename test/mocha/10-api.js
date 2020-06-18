/*
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {ManifestClient} = require('@digitalbazaar/web-app-manifest-utils');
const brHttpsAgent = require('bedrock-https-agent');

describe(`Manifest Proxy Node`, () => {
  describe(`'/manifest.json' Tests`, () => {
    it(`success response'`,
      async () => {
        const host = 'frontendmasters.com';
        const {httpsAgent} = brHttpsAgent;
        const manifestClient = new ManifestClient({
          host,
          httpsAgent,
        });

        let result;
        let err;
        try {
          result = await manifestClient.getManifest();
        } catch(e) {
          err = e;
        }
        should.exist(result);
        should.not.exist(err);
        result.should.include.keys(['icons']);
      }
    );

    it(`404 error when there is no manifest without proxy'`,
      async () => {
        const host = 'en.wikipedia.org';
        const manifestClient = new ManifestClient({host});

        let result;
        let err;
        try {
          result = await manifestClient.getManifest();
        } catch(e) {
          err = e;
        }
        should.exist(err);
        should.not.exist(result);
        err.status.should.equal(404);
      }
    );
  });
});
