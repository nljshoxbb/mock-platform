import path from 'path';

import Config from '@/server/config';
import fs from 'fs-extra';
import mongoose from 'mongoose';

import connectDatabase from './database';
import { fileExist } from './utils/utils';

/** 初始化数据库脚本 */

function install() {
  console.log(Config.APP_RUNTIME, Config.APP_SERVER);
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
}

install();
