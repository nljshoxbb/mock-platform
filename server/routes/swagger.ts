import path from 'path';

import Config from '@/server/config';
import jsYaml from 'js-yaml';
import KoaRouter from 'koa-router';
import swaggerJSDoc from 'swagger-jsdoc';

export default function swaggerRouter(router: KoaRouter) {
  /** swagger */
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'mock平台api',
      version: '1.0.0',
      description: 'API文档'
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

  router.get('/swagger.yaml', async function (ctx) {
    ctx.body = jsYaml.dump(swaggerSpec);
  });
}
