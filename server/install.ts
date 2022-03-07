import path from 'path';

import Config from '@/server/config';
import mongoose from 'mongoose';

import connectDatabase from './database';
import Log from './utils/Log';
import { fileExist } from './utils/utils';

/** 初始化数据库脚本 */

function install() {
  if (fileExist(path.join(Config.APP_RUNTIME, 'db.lock'))) {
    throw new Error('db.lock文件已存在。可重删除db.lock重新安装');
  }
  initDatabse();
}

async function initDatabse() {
  // mongoose.createConnection
  await connectDatabase(Config.db.url);

  const projectCollection = mongoose.connection.db.collection('project');
  projectCollection.createIndex({ uid: 1 });
  projectCollection.createIndex({ name: 1 });
  Log.info('初始化成功');
  process.exit(0);
}

install();
