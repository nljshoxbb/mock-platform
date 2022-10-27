import InterfaceModel from '@/server/models/interface';
import axios from 'axios';
import stringify from 'json-stringify-safe';
import { Context, Next } from 'koa';
import { isEmpty } from 'lodash';
import Mock from 'mockjs';
import { compile, match, parse, pathToRegexp } from 'path-to-regexp';
import { RequestBody, Response } from 'swagger-jsdoc';

import { getModelInstance, objectIdToString, responseBody } from './../utils/utils';
import ExpectedModel from '../models/expected';
import ProjectModel from '../models/project';
import Log from '../utils/Log';

const handleType = (data) => {
  let result;

  if (data.mock?.enum) {
    return `@pick(${data.mock?.enum})`;
  }

  if (data.mock?.value) {
    return (result = data.mock.value);
  }

  switch (data.type) {
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

const delayFn = async (ms) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

/** /api/${id}/${status} -> /api/:id/:status */
const converPath = (pathString) => {
  /** 转换，进行匹配 */
  const decodePath = decodeURIComponent(pathString);
  return decodePath.replace(/\{(.+?)\}/g, (val, val1) => {
    return `:${val1}`;
  });
};

/**
 * 根据schema生成mock数据
 * @param schema
 * @param mockObject
 * @returns
 */
const generateMockField = (schema: any, mockObject = {}) => {
  if (!schema) {
    return {};
  }

  const { properties, type } = schema;

  if (type === 'object') {
    if (properties) {
      for (const p of Object.entries(properties)) {
        const [key, value] = p as any;

        /** schema value中 count,default 为编辑时输入的自定义属性 */
        if (value) {
          if (value.type === 'array') {
            const num = value.mock ? value.mock.num : 5;
            if (value.items && value.items.type === 'object') {
              mockObject[`${key}|${num}`] = [generateMockField(value.items)];
            }

            if (value.items && value.items.type === 'number') {
              mockObject[`${key}|${num}`] = [1];
            }
          } else if (value.type === 'object') {
            mockObject[key] = generateMockField(value);
          } else {
            mockObject[key] = handleType(value.type);
          }
        }

        if (['string', 'integer', 'boolean', 'number'].includes(value.type)) {
          /** 处理非对象字段 */
          mockObject[key] = handleType(value);
        }
      }
    }
  }

  return mockObject;
};

const proxyRequest = async ({ url, method, query, header, body }) => {
  let result;
  try {
    const config: any = {
      method,
      url,
      params: query,
      data: body,
      headers: header
    };
    if (header.range) {
      config.responseType = 'stream';
    }

    Log.info(`proxy config->${JSON.stringify(config)}`);
    result = await axios(config);
    // Log.info(`proxy result->${stringify(result.data)}`);
    return Promise.resolve(result);
  } catch (error) {
    Log.error(`proxy error->${error}`);
    return Promise.resolve(error);
  }
};

const mockMiddleware = async (ctx: Context, next: Next) => {
  const { request } = ctx;
  const method = request.method.toLocaleLowerCase() as any;
  const body = request.body;
  const query = request.query as any;
  const header = request.header;

  let path = ctx.path;
  if (path.indexOf('/mock/') !== 0) {
    await next();
    return;
  }

  const paths = ctx.path.split('/');
  const projectId = paths[2];
  paths.splice(0, 3);
  path = '/' + paths.join('/');
  ctx.body = {};

  if (!projectId) {
    return (ctx.body = responseBody(null, 400, 'project_id为空'));
  }

  const interfaceModel = getModelInstance<InterfaceModel>(InterfaceModel);

  const projectModel = getModelInstance<ProjectModel>(ProjectModel);

  const expectedModel = getModelInstance<ExpectedModel>(ExpectedModel);

  const isProjectExit = await projectModel.isExist(projectId);

  if (!isProjectExit) {
    return (ctx.body = responseBody(null, 400, 'project不存在'));
  }

  /** 进行url匹配 */
  const allInterface = await interfaceModel.get({ project_id: projectId });

  let result: any;

  allInterface.some((i) => {
    if (i.method === method && i.path === path) {
      result = i;
      return true;
    }
  });

  if (!result) {
    allInterface.some((i) => {
      const fn = match(converPath(i.path), { decode: decodeURIComponent });
      /** _query/_count 做处理 */
      const val = fn(path);
      if (val && i && i.method === method) {
        result = i;
        return true;
      }
    });
  }

  if (result) {
    Log.info(`请求${method}:${path}匹配到数据库接口${result.method}:${result.path}`);
  }

  if (!result) {
    return (ctx.body = responseBody(null, 404, '没有mock数据'));
  }
  const interfaceData = await interfaceModel.getDetail(result.id);

  /** 如果有启用的期望值，直接返回期望值 */
  // const [interfaceData] = await interfaceModel.getDataByPath(projectId, method, decodeURIComponent(path));
  // console.log(interfaceData, isProjectExit);
  /** 优先走代理 */
  if (interfaceData?.proxy && isProjectExit.auto_proxy_url && isProjectExit.auto_proxy) {
    /** 接口是否打开代理 */
    const resData = await proxyRequest({
      url: `${isProjectExit.auto_proxy_url}${path}`,
      method,
      query,
      header,
      body
    });
    /** 有代理返回数据则返回，没有则走mock数据 */
    if (resData) {
      if (axios.isAxiosError(resData)) {
        if (resData?.response) {
          Object.keys(resData.response.headers).forEach((i) => {
            if (resData.response?.headers[i]) {
              ctx.set(i, resData.response?.headers[i]);
            }
          });

          if (resData.response?.data) {
            ctx.response.status = 200;
            return (ctx.body = resData.response.data);
          }
        }
      } else {
        /** 200 */
        resData.headers &&
          Object.keys(resData.headers).forEach((i) => {
            ctx.set(i, resData.headers[i]);
          });

        ctx.response.status = resData.status;
        return (ctx.body = resData.data);
      }
    }
  }
  if (interfaceData) {
    let expectedResult;
    const expectedRes = await expectedModel.findByInterfaceId(objectIdToString(interfaceData._id));

    const [expectedItem] = expectedRes.filter((i) => i.status);

    if (expectedItem) {
      const { delay, response_body } = expectedItem;

      /** mock 延时 */
      if (delay) {
        await delayFn(delay);
      }
      if (response_body) {
        expectedResult = JSON.parse(response_body);
      }
      return (ctx.body = responseBody(expectedResult, 200));
    }

    const { request_body, responses } = interfaceData;

    const response = JSON.parse(responses || '{}') as Response;
    const requestBody = JSON.parse(request_body || '{}') as RequestBody;
    let requestBodySchema;
    if (!isEmpty(requestBody)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      requestBodySchema = requestBody.content['application/json'];
    }

    const { content } = response;

    if (content) {
      const types = Object.keys(content);
      if (types[0] === 'application/octet-stream') {
        return (ctx.body = 10101);
      } else {
        const { schema } = content[types[0]];
        /** 可自定义返回格式+包裹mock数据 */
        // return (ctx.body = responseBody(expectedResult || Mock.mock(generateMockField(schema)), 200));
        const mockData = expectedResult || Mock.mock(generateMockField(schema));
        if (mockData.status) {
          mockData.status = 200;
          mockData.timestamp = +new Date();
        }
        return (ctx.body = mockData);
      }
    }
  } else {
    ctx.body = responseBody(null, 404, '没有mock数据');
  }
};

export default mockMiddleware;
