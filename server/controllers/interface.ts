import InterfaceModel, { InterfaceItem } from '@/server/models/interface';
import Log from '@/server/utils/Log';
import SwaggerParser from '@apidevtools/swagger-parser';
import axios from 'axios';
// import yamljs from 'yamljs';
import jsYaml from 'js-yaml';
import { Context } from 'koa';

import { SyncDataTypeEnum } from '../constants/syncDataTypeEnum';
import CategoryModel from '../models/category';
import ProjectModel from '../models/project';
import { getModelInstance, responseBody } from '../utils/utils';
import BaseController from './base';

const getSchema = (params) => {
  if (params?.content) {
    let result;
    Object.keys(params.content).forEach((i) => {
      result = params.content[i].schema;
    });
    return result;
  } else {
    return '';
  }
};

export default class InterfaceController extends BaseController {
  model: InterfaceModel;
  categoryModel: CategoryModel;
  projectModel: ProjectModel;

  constructor(ctx: Context) {
    super(ctx);
    this.model = getModelInstance<InterfaceModel>(InterfaceModel);
    this.categoryModel = getModelInstance<CategoryModel>(CategoryModel);
    this.projectModel = getModelInstance<ProjectModel>(ProjectModel);
  }

  public async syncByPorjectId(projectId: string, apiAddress: string, type: keyof typeof SyncDataTypeEnum) {
    try {
      const res = await axios.get(apiAddress);
      let jsonData;
      if (res.status === 200 && res.data) {
        if (type === SyncDataTypeEnum.yaml) {
          jsonData = jsYaml.load(res.data);
        }

        if (type === SyncDataTypeEnum.json) {
          jsonData = res.data;
        }
      }
      if (!jsonData) {
        return Promise.resolve(undefined);
      }

      const api = await SwaggerParser.dereference(jsonData);
      const interfaceBatchUpdate: InterfaceItem[] = [];

      const { paths } = api;
      const categoryMap = {};
      const pathArr: string[] = [];

      Object.keys(paths).forEach((i) => {
        pathArr.push(i);
        const method = Object.keys(paths[i])[0];
        const { tags, description, requestBody, responses, parameters } = paths[i][method];

        let responseSchema;

        const tag = tags[0];
        categoryMap[tag] = {
          name: tag,
          project_id: projectId
        };

        Object.keys(responses).forEach((k) => {
          if (k === '200') {
            responseSchema = getSchema(responses[k]);
          }
        });

        interfaceBatchUpdate.push({
          path: i,
          method,
          project_id: projectId,
          tags: tag,
          description,
          responses: JSON.stringify(responseSchema),
          request_body: JSON.stringify(requestBody),
          parameters: JSON.stringify(parameters)
        });
      });

      /** category去重处理 */
      const catArr = Object.keys(categoryMap).map((i) => categoryMap[i]);
      const categoryOperation: any[] = [];

      catArr.forEach((i) => {
        const updateObj = {
          updateOne: {
            filter: { name: i.name, project_id: projectId },
            update: i,
            upsert: true
          }
        };
        categoryOperation.push(updateObj);
      });

      await this.categoryModel.bulkWrite(categoryOperation);

      /** category_id 赋值 */
      const nowCategory = await this.categoryModel.get();
      const nowCategoryMap = {};
      nowCategory.forEach((i) => {
        nowCategoryMap[i.name] = i._id.toString();
      });

      interfaceBatchUpdate.forEach((i) => {
        if (nowCategoryMap[i.tags]) {
          i.category_id = nowCategoryMap[i.tags];
        }
      });

      const operations: any[] = [];

      interfaceBatchUpdate.forEach((i) => {
        const updateObj = {
          updateOne: {
            filter: { path: i.path, method: i.method, project_id: projectId },
            update: i,
            upsert: true
          }
        };
        operations.push(updateObj);
      });

      /** 接口去重，覆盖处理 */
      await this.model.bulkWrite(operations);
      return Promise.resolve({});
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * 同步数据
   * @param ctx
   * @returns
   */
  public async syncData(ctx: Context) {
    try {
      const { api_address, project_id, type } = ctx.request.body;

      if (!project_id || !api_address || !type) {
        return (ctx.body = responseBody(null, 400, '参数错误'));
      }

      const projectModel = getModelInstance<ProjectModel>(ProjectModel);

      const isExist = await projectModel.isExist(project_id);

      if (!isExist) {
        return (ctx.body = responseBody(null, 200, 'project_id不存在'));
      }
      const result = await this.syncByPorjectId(project_id, api_address, type);
      if (!result) {
        return (ctx.body = responseBody(null, 500, '地址错误'));
      }
      ctx.body = responseBody(result, 200, '操作成功');
    } catch (error) {
      Log.error(error);
      if (error.message.indexOf('ENOTFOUND') !== -1) {
        ctx.body = responseBody(null, 400, '地址错误');
      }
    }
  }

  /**
   * 获取接口列表
   * 包含项目-类目-接口 的树层级
   * @param ctx
   */
  public async list(ctx: Context) {
    try {
      const projectArray = await this.projectModel.get();
      const result: any[] = [];

      for (let i = 0; i < projectArray.length; i++) {
        const projectItem = projectArray[i];
        const categoryList = await this.categoryModel.get({ project_id: projectItem.id });
        const catResult: any = [];

        for (let k = 0; k < categoryList.length; k++) {
          const catId = categoryList[k]._id.toString();

          const interfaceList = await this.model.get({ category_id: catId });

          const categoryItem: Record<string, any> = {
            category_id: catId,
            category_name: categoryList[k].name,
            interface_list: interfaceList.map((i) => ({
              id: i._id,
              method: i.method,
              path: i.path,
              description: i.description
            }))
          };

          catResult.push(categoryItem);
        }

        result.push({ project_id: projectItem.id, project_name: projectItem.name, desc: projectItem.desc, category_list: catResult });
      }

      ctx.body = responseBody({ list: result }, 200);
    } catch (error) {}
  }

  /**
   * 获取接口详情
   * @param ctx
   * @returns
   */
  public async detail(ctx: Context) {
    const { id } = ctx.request.body;

    const result = await this.model.getDetail(id as string);

    if (!result) {
      return (ctx.body = responseBody(null, 404, 'id不存在'));
    }

    ctx.body = responseBody(result);
  }
}
