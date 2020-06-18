/*
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import {ManifestClient} from '@digitalbazaar/web-app-manifest-utils';

describe(`Manifest Client`, () => {
  describe(`'/manifest.json' Tests`, () => {
    it(`success response'`,
      async () => {
        const baseUrl = 'https://wallet.interop.digitalbazaar.com/';
        const manifestClient = new ManifestClient({baseUrl});

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
  });
});
