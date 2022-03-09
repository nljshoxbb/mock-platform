import { Context } from 'koa';

import { getModelInstance } from './../utils/utils';
import { getAuthToken } from '../middlewares/auth';
import TokenModel from '../models/token';

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
}
