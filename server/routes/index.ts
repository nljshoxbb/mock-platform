import Config from '@/server/config';
import * as project from '@/server/controllers/project';
import compose from 'koa-compose';
import KoaRouter from 'koa-router';

function routes() {
  const router = new KoaRouter();

  router.prefix(Config.prefix);

  router.get('/v1/project', project.Find);

  return compose([router.routes(), router.allowedMethods()]);
}

export default routes;
