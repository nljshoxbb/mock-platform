import path from 'path';

import Config from '@/server/config';
import catchError from '@/server/middlewares/catchError';
import routes from '@/server/routes';
import Log from '@/server/utils/Log';
import Koa from 'koa';
// import bodyParser from 'koa-bodyparser';
import koaBody from 'koa-body';
import serverStatic from 'koa-static';
import { koaSwagger } from 'koa2-swagger-ui';

import connectDatabase from './database';
import authMiddleware from './middlewares/auth';
import mockMiddleware from './middlewares/mock';
import { getIPAddress } from './utils/utils';

const app = new Koa();

// app.use(bodyParser({ strict: false, jsonLimit: '2mb', formLimit: '2mb', textLimit: '2mb' }));
app.use(koaBody({ multipart: true }));
app.use(serverStatic(path.join(Config.APP_RUNTIME, 'public'), { gzip: true }));

app.use(mockMiddleware);
app.use(authMiddleware);
app.use(catchError);
app.use(routes());
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
      const address = `http://${getIPAddress()}:${Config.port}`;
      Log.info(`服务已启动，接口地址: ${address}/api`);
      Log.info(`文档地址: ${address}/html/swagger`);
      Log.info(`文档yaml地址: ${address}/swagger.yaml`);
      Log.info(`文档json地址: ${address}/swagger.json`);
    });
  } catch (error) {
    Log.error(error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
