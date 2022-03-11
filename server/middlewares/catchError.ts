import Log from '@/server/utils/Log';

import { responseBody } from '../utils/utils';

const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    Log.error(error + ' catchError middleware');
    if (error.errorCode) {
      Log.warning('捕获异常');
      return (ctx.body = responseBody(null, 500, '系统错误'));
    } else {
      return (ctx.body = responseBody(null, 500, '系统错误'));
    }
  }
};

export default catchError;
