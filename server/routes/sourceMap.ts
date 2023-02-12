import SourceMapController from '@/server/controllers/sourceMap';
import { Context } from 'koa';
import Router from 'koa-router';

const initController = (ctx) => {
  return new SourceMapController(ctx);
};

export default function projectRouter(router: Router) {
  router.post('/v1/souceMap/list', async (ctx: Context) => {
    // await initController(ctx).getList();
    // await initController(ctx).create();
  });

  router.post('/v1/souceMap/create', async (ctx: Context) => {
    await initController(ctx).create();
  });

  router.put('/v1/souceMap/edit', async (ctx: Context) => {
    // await initController(ctx).edit();
  });

  router.post('/v1/souceMap/view', async (ctx: Context) => {
    await initController(ctx).view();
  });
}
