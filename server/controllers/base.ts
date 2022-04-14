import { Context } from 'koa';

import { getModelInstance } from './../utils/utils';
import { getAuthToken } from '../middlewares/auth';
import TokenModel from '../models/token';
import UserModel from '../models/user';

export default class BaseController {
  ctx: Context;
  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  public async getUid() {
    const { authorization } = this.ctx.request.header;
    const token = getAuthToken(authorization);
    const tokenModel = getModelInstance<TokenModel>(TokenModel);
    const res = await tokenModel.get({ token });

    if (res?.[0]) {
      return Promise.resolve(res[0].uid);
    }
    return Promise.resolve('');
  }

  public async getAccount(uid: string): Promise<any> {
    const userModel = getModelInstance<UserModel>(UserModel);
    const res = await userModel.getUserById(uid);
    if (res) {
      return Promise.resolve(res);
    }
    return Promise.resolve('');
  }
}
