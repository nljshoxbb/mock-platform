import InterfaceModel from '@/server/models/interface';
import { Context, Next } from 'koa';
import Mock from 'mockjs';
import { Schema } from 'swagger-jsdoc';

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

const generateMockField = (schema: any, mockObject = {}) => {
  const { properties, type } = schema;

  for (const d of Object.entries(properties)) {
    const [key, value] = d as any;

    if (typeof value === 'object' && value) {
      if (value.type === 'array') {
        if (value.items && value.items.type === 'object') {
          mockObject[`${key}|3`] = [generateMockField(value.items)];
        }
      } else {
        mockObject[key] = handleType(value.type);
      }
    }

    if (['string', 'integer', 'boolean', 'number'].includes(value.type)) {
      /** 处理非对象字段 */
      mockObject[key] = handleType(value.type);
    }
  }
  return mockObject;
};

const mockMiddleware = async (ctx: Context, next: Next) => {
  //   console.log(ctx.request, ctx.path);
  const { url, method } = ctx.request;
  const header = ctx.request.header;

  let path = ctx.path;
  console.log(path);
  if (path.indexOf('/mock/') !== 0) {
    await next();
    return;
  }

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
  if (res[0]) {
    const { request_body, responses } = res[0];
    const responseSchema = JSON.parse(responses);
    console.log(responses, responseSchema, generateMockField(responseSchema));
    ctx.body = Mock.mock(generateMockField(responseSchema));
  }
};

export default mockMiddleware;
