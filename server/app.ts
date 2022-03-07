import path from 'path';

import Config from '@/server/config';
import catchError from '@/server/middlewares/catchError';
import routes from '@/server/routes';
import Log from '@/server/utils/Log';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serverStatic from 'koa-static';
import { koaSwagger } from 'koa2-swagger-ui';

import connectDatabase from './database';
import authMiddleware from './middlewares/auth';

const app = new Koa();

app.use(authMiddleware);
app.use(catchError);
app.use(bodyParser({ strict: false, jsonLimit: '2mb', formLimit: '2mb', textLimit: '2mb' }));
app.use(routes());
app.use(serverStatic(path.join(Config.APP_RUNTIME, 'public'), { gzip: true }));
app.use(
  koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
      url: '/swagger.json'
    }
  })
);

async function main(): Promise<void> {
  try {
    await connectDatabase(Config.db.url);
    app.listen(Config.port, () => {
      Log.info(`服务已启动，请打开下面链接访问: \nhttp://127.0.0.1:${Config.port}/`);
    });
  } catch (error) {
    Log.error(error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
