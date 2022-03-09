import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Context, Next } from 'koa';

import TokenModel from '../models/token';
import Log from '../utils/Log';
import { PASSWORD_SALT, getModelInstance, responseBody } from '../utils/utils';

export const getAuthToken = (auth = '') => {
  const reg = auth.match(/Bearer (\S*)/);
  if (reg) {
    return reg[1];
  }
  return '';
};

const UN_LOGIN_URL = ['/api/v1/user/login'];

const authMiddleware = async (ctx: Context, next: Next) => {
  const notLogin = () => {
    ctx.body = responseBody(null, 401, '用户未登录');
  };

  const tokenExpired = () => {
    ctx.body = responseBody(null, 401, 'token已过期');
  };
  try {
    const { authorization } = ctx.request.header;
    const { url } = ctx.request;

    if (UN_LOGIN_URL.includes(url) || url.indexOf('/api') === -1 || url.indexOf('/mock/') !== -1) {
      await next();
    } else {
      if (authorization) {
        const token = getAuthToken(authorization);
        if (token) {
          const tokenModal = getModelInstance<TokenModel>(TokenModel);
          const res = jwt.verify(token, PASSWORD_SALT) as any;
          /** Authorization头是否包含token信息 */
          if (res) {
            /** 是否已登录 */
            const isLogin = await tokenModal.get({ token });
            if (isLogin[0]) {
              /** 是否已过期 */
              if (Math.floor(+new Date() / 1000) > res.exp) {
                return tokenExpired();
              }
              await next();
              return;
            } else {
              return tokenExpired();
            }
          } else {
            return notLogin();
          }
        }
        return notLogin();
      } else {
        return notLogin();
      }
    }
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      ctx.body = responseBody(null, 401, 'token已过期');
    }
    Log.error(error);
  }
};

export default authMiddleware;
