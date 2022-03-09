import path from 'path';

import defaultConfig from '@/config/default.json';

const APP_ROOT = path.resolve(__dirname, '..');
const APP_SERVER = __dirname;
const APP_RUNTIME = path.resolve(__dirname, '../../');
const APP_LOG = path.join(APP_RUNTIME, 'log');
const prefix = '/api';

export default {
  APP_ROOT,
  APP_SERVER,
  APP_LOG,
  prefix,
  APP_RUNTIME,
  ...defaultConfig,
  port: defaultConfig.port,
  expired: 1 * 60 * 60 * 24 * 30
};
