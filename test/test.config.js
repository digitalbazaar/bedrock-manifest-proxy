/*
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const path = require('path');

config.mocha.tests.push(path.join(__dirname, 'mocha'));
config['https-agent'].rejectUnauthorized = false;

config.karma.suites['bedrock-manifest-proxy'] = path.join('web', '**', '*.js');

config.karma.config.proxies = {
  '/': 'https://localhost:18443'
};
config.karma.config.proxyValidateSSL = false;

config.karma.config.customLaunchers = {
  Chrome_without_security: {
    base: 'ChromeHeadless',
    flags: [
      // '--disable-web-security',
      '--ignore-ssl-errors',
      '--ignore-certificate-errors'
    ]
  }
};
