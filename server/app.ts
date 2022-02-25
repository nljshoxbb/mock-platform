import path from 'path';

import Config from '@/server/config';
import routes from '@/server/routes';
import Log from '@/server/utils/Log';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serverStatic from 'koa-static';

import connectDatabase from './database';

const app = new Koa();

app.use(bodyParser({ strict: false, jsonLimit: '2mb', formLimit: '2mb', textLimit: '2mb' }));
app.use(routes());
app.use(serverStatic(path.join(Config.APP_RUNTIME, 'public'), { gzip: true }));

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
