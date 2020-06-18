/*
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import {ManifestClient} from '@digitalbazaar/web-app-manifest-utils';

describe(`Manifest Proxy Browser`, () => {
  describe(`'/manifest.json' Tests`, () => {
    it.only(`success response'`,
      async () => {
        const host = 'frontendmasters.com';
        const manifestClient = new ManifestClient({host, manifestProxy: true});

        let result;
        let err;
        try {
          result = await manifestClient.getManifest();
        } catch(e) {
          err = e;
        }
        console.log(err);
        console.log(JSON.stringify(result, null, 2));
      }
    );

    it(`404 error when there is no manifest via proxy'`,
      async () => {
        const host = 'en.wikipedia.org';
        const manifestClient = new ManifestClient({host, manifestProxy: true});

        let result;
        let err;
        try {
          result = await manifestClient.getManifest();
        } catch(e) {
          err = e;
        }
        should.exist(err);
        console.log('STATUS', err.status);
        err.status.should.equal(404)
      }
    );
  });
});
