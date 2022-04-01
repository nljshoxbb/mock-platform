import path from 'path';

import mongoose from 'mongoose';

import Config from './config';
import connectDatabase from './database';
import UserModel from './models/user';
import Log from './utils/Log';
import { fileExist, generatePasswod, getModelInstance } from './utils/utils';

/** 初始化数据库脚本 */

function install() {
  if (fileExist(path.join(Config.APP_RUNTIME, 'db.lock'))) {
    throw new Error('db.lock文件已存在。可重删除db.lock重新安装');
  }
  initDatabse();
}

async function initDatabse() {
  await connectDatabase(Config.db.url, Config.db.user, Config.db.pwd);

  const projectCollection = mongoose.connection.db.collection('project');
  projectCollection.createIndex({ uid: 1 });
  projectCollection.createIndex({ name: 1 });

  const userModel = getModelInstance<UserModel>(UserModel);

  const list = await userModel.get();
  if (list.length > 0) {
    Log.info(`已初始化,账号：${Config.admin},密码：${Config.adminPwd}`);
    process.exit(0);
  }

  userModel
    .create({
      username: Config.admin,
      role: '0',
      password: generatePasswod(Config.adminPwd)
    })
    .then(() => {
      Log.info(`初始化成功,账号：${Config.admin},密码：${Config.adminPwd}`);
      process.exit(0);
    })
    .catch((err) => {
      throw new Error(err);
    });
}

install();
