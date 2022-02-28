import path from 'path';

import Config from '@/server/config';
import interfaceRouter from '@/server/routes/interface';
import projectRouter from '@/server/routes/project';
import compose from 'koa-compose';
import KoaRouter from 'koa-router';
import swaggerJSDoc from 'swagger-jsdoc';

const router = new KoaRouter();

function routes() {
  router.prefix(Config.prefix);

  projectRouter(router);
  interfaceRouter(router);
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'mock平台api',
      version: '1.0.0',
      description: 'API'
    },
    host: `localhost:${Config.port}`,
    base: '/'
  };

  const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, '../routes/*.js')]
  };

  const swaggerSpec = swaggerJSDoc(options);

  router.get('/swagger.json', async function (ctx) {
    ctx.set('Content-Type', 'application/json');
    ctx.body = swaggerSpec;
  });

  return compose([router.routes(), router.allowedMethods()]);
}

export default routes;
