import Config from '@/server/config';
import expectedRouter from '@/server/routes/expected';
import interfaceRouter from '@/server/routes/interface';
import projectRouter from '@/server/routes/project';
import sourceMapRouter from '@/server/routes/sourceMap';
import swaggerRouter from '@/server/routes/swagger';
import userRouter from '@/server/routes/user';
import compose from 'koa-compose';
import KoaRouter from 'koa-router';

const apiRouter = new KoaRouter();

const router = new KoaRouter();

const routerArray = [projectRouter, interfaceRouter, expectedRouter, userRouter, sourceMapRouter];

function routes() {
  apiRouter.prefix(Config.prefix);

  routerArray.forEach((i) => {
    i(apiRouter);
  });
  router.use(apiRouter.routes());

  swaggerRouter(router);

  return compose([router.routes(), router.allowedMethods()]);
}

export default routes;
