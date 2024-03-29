import path from 'path';

const APP_ROOT = path.resolve(__dirname, '..');
const APP_SERVER = __dirname;
const APP_RUNTIME = path.resolve(__dirname, '../../');
const APP_LOG = path.join(APP_RUNTIME, 'log');
const prefix = '/api';

export const isPro = process.env.NODE_ENV === 'production';
export default {
  APP_ROOT,
  APP_SERVER,
  APP_LOG,
  prefix,
  APP_RUNTIME,
  expired: 1 * 60 * 60 * 24 * 30,
  port: 3888,
  db: {
    name: 'mock-platform',
    // url: `mongodb://${isPro ? process.env.docker_db : '192.168.124.130:27017'}/mock-platform`,
    // mongodb://databaseroot:databaseroot@db:20718/mock-platform
    /** 连接docker mongodb */
    url: `mongodb://databaseroot:databaseroot@localhost:27018/mock-platform`,
    // url: `mongodb://${isPro ? 'databaseroot:databaseroot@' + process.env.docker_db : 'localhost'}:27017/mock-platform`,
    user: 'databaseroot',
    pwd: 'databaseroot'
  },
  admin: 'admin',
  adminPwd: 'admin'
};
