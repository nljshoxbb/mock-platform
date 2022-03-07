import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Context, Next } from 'koa';

import TokenModel from '../models/token';
import Log from '../utils/Log';
import { PASSWORD_SALT, getModelInstance, responseBody } from '../utils/utils';

const UN_LOGIN_URL = ['/api/v1/user/login'];

const authMiddleware = async (ctx: Context, next: Next) => {
  try {
    const { authorization } = ctx.request.header;
    const { url } = ctx.request;

    if (typeof authorization === 'string' && !UN_LOGIN_URL.includes(url)) {
      const reg = authorization.match(/Bearer (\S*)/);
      let token;
      if (reg) {
        token = reg[1];

        const tokenModal = getModelInstance<TokenModel>(TokenModel);
        const res = jwt.verify(token, PASSWORD_SALT) as any;
        if (res) {
          // 是否存在，
          const isLogin = await tokenModal.get({ token });

          if (isLogin[0]) {
            // console.log(Math.floor(+new Date() / 1000), res.exp);
            if (Math.floor(+new Date() / 1000) > res.exp) {
              return (ctx.body = responseBody(null, 401, 'token已过期'));
            }
          } else {
            return (ctx.body = responseBody(null, 401, 'token已过期'));
          }
        } else {
          // return (ctx.body = responseBody(null, 401, '用户未登录'));
        }
      }
      // return (ctx.body = responseBody(null, 401, '用户未登录'));

      // const data = await tokenModal.get({ token });
    }
    await next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      ctx.body = responseBody(null, 401, 'token已过期');
    }
    Log.error(error);
  }
};

export default authMiddleware;
