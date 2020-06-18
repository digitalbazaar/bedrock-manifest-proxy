/*
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import {ManifestClient} from '@digitalbazaar/web-app-manifest-utils';

describe(`Manifest Proxy Browser`, () => {
  describe(`'/manifest.json' Tests`, () => {
    it(`success response'`,
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
        should.exist(result);
        should.not.exist(err);
        result.should.include.keys(['icons']);
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
        should.not.exist(result);
        err.status.should.equal(404);
      }
    );
  });
});
