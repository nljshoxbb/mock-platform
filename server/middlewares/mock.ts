import InterfaceModel from '@/server/models/interface';
import { Context, Next } from 'koa';
import { isEmpty } from 'lodash';
import Mock from 'mockjs';
import { RequestBody, Response, Schema } from 'swagger-jsdoc';

import { getModelInstance, responseBody } from './../utils/utils';
import ProjectModel from '../models/project';

const handleType = (type) => {
  let result;
  switch (type) {
    case 'array':
      result = [];
      break;
    case 'string':
      result = `@string("lower", 20)`;
      break;
    case 'integer':
      result = '@increment';
      break;
    case 'boolean':
      result = '@boolean';
      break;
    default:
      break;
  }
  return result;
};

/**
 * 根据schema生成mock数据
 * @param schema
 * @param mockObject
 * @returns
 */
const generateMockField = (schema: any, mockObject = {}) => {
  const { properties, type } = schema;

  if (type === 'object') {
    if (properties) {
      for (const p of Object.entries(properties)) {
        const [key, value] = p as any;

        /** schema value中 count,default 为编辑时输入的自定义属性 */
        if (value) {
          if (value.type === 'array') {
            if (value.items && value.items.type === 'object') {
              console.log(value);
              mockObject[`${key}|${value?.count || 5}`] = [generateMockField(value.items)];
            }

            if (value.items && value.items.type === 'number') {
              mockObject[`${key}|${value?.count || 5}`] = [1];
            }
          } else if (value.type === 'object') {
            mockObject[key] = generateMockField(value);
          } else {
            mockObject[key] = handleType(value.type);
          }
        }

        if (['string', 'integer', 'boolean', 'number'].includes(value.type)) {
          /** 处理非对象字段 */
          mockObject[key] = handleType(value.type);
        }
      }
    }
  }

  return mockObject;
};

const getRequestBody = () => {};

const mockMiddleware = async (ctx: Context, next: Next) => {
  //   console.log(ctx.request, ctx.path);
  const { url, method, body, query } = ctx.request;
  const header = ctx.request.header;

  let path = ctx.path;
  if (path.indexOf('/mock/') !== 0) {
    await next();
    return;
  }
  console.log(body, query);

  const paths = ctx.path.split('/');
  const projectId = paths[2];
  paths.splice(0, 3);
  path = '/' + paths.join('/');
  ctx.body = {};

  // ctx.set('Access-Control-Allow-Origin', header.origin ? header.origin?.toString() : '');
  // ctx.set('Access-Control-Allow-Credentials', 'true');
  if (!projectId) {
    return (ctx.body = responseBody(null, 400, 'project_id为空'));
  }

  const interfaceModel = getModelInstance<InterfaceModel>(InterfaceModel);

  const projectModel = getModelInstance<ProjectModel>(ProjectModel);

  const isProjectExit = projectModel.isExist(projectId);

  if (!isProjectExit) {
    return (ctx.body = responseBody(null, 400, 'project不存在'));
  }

  /** 如果有启用的期望值，直接返回期望值 */

  const res = await interfaceModel.getDataByPath(projectId, method.toLocaleLowerCase(), path);
  console.log(res, projectId, method.toLocaleLowerCase(), path);
  if (res[0]) {
    const { request_body, responses } = res[0];

    const response = JSON.parse(responses || '{}') as Response;
    const requestBody = JSON.parse(request_body || '{}') as RequestBody;
    let requestBodySchema;
    if (!isEmpty(requestBody)) {
      requestBodySchema = requestBody.content['application/json'];
    }

    const { content } = response;

    if (content) {
      const types = Object.keys(content);
      if (types[0] === 'application/octet-stream') {
        const { schema } = content[types[0]];
        console.log(Mock.mock(generateMockField(schema)));
        return (ctx.body = 111);
      } else {
        const { schema } = content[types[0]];
        return (ctx.body = responseBody(
          {
            status: 200,
            mock_response: Mock.mock(generateMockField(schema))
          },
          200
        ));
        // }
      }
    }

    // if (responseSchema.format && responseSchema.format === 'binary') {
    //   // if(responseSchema.)
    //   // ctx.body =
    // } else {
    //   ctx.body = responseBody(Mock.mock(generateMockField(responseSchema)), 200);
    // }
  } else {
    ctx.body = responseBody(null, 404, '没有mock数据');
  }
};

export default mockMiddleware;
