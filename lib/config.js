/*!
 * Copyright (c) 2019-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {config} from '@bedrock/core';

const namespace = 'manifest-proxy';
const cfg = config[namespace] = {};

cfg.route = '/manifest';

// web app manifest cache config
cfg.manifestCache = {
  // 100 MiB (roughly, is actually in chars)
  size: 1024 * 1024 * 100,
  // 5 minutes
  ttl: 5 * 60 * 1000,
  // request timeout for fetching a manifest (5 seconds)
  requestTimeout: 5 * 1000,
};
