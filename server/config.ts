import path from 'path';

const APP_ROOT = path.resolve(__dirname, '..');
const APP_SERVER = __dirname;
const APP_RUNTIME = path.resolve(__dirname, '../../');
const APP_LOG = path.join(APP_RUNTIME, 'log');
const prefix = '/api';

const isPro = process.env.NODE_ENV === 'production';
console.log(isPro);
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
    url: `mongodb://${isPro ? process.env.docker_db : 'localhost:27017'}/mock-platform`,
    user: 'databaseroot',
    pwd: 'databaseroot'
  },
  admin: 'admin',
  adminPwd: 'admin'
};
