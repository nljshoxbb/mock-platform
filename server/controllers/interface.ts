import InterfaceModel, { InterfaceItem } from '@/server/models/interface';
import Log from '@/server/utils/Log';
import SwaggerParser from '@apidevtools/swagger-parser';
import axios from 'axios';
import jsYaml from 'js-yaml';
import { Context } from 'koa';

import config from '../config';
import { SyncDataTypeEnum } from '../constants/syncDataTypeEnum';
import CategoryModel from '../models/category';
import ProjectModel from '../models/project';
import { getIPAddress, getModelInstance, responseBody } from '../utils/utils';
import BaseController from './base';

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

  /**
   *
   * @param projectId
   * @param apiAddress
   * @param type 目前只支持yaml json
   * @returns
   */
  public async syncByPorjectId(projectId: string, apiAddress: string, type: string) {
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
        return Promise.resolve('addressError');
      }

      /** 关联所有ref */
      const api = (await SwaggerParser.dereference(jsonData)) as any;
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
            responseSchema = responses[k];
          }
        });

        /** 批量更新 */
        interfaceBatchUpdate.push({
          path: i,
          method,
          project_id: projectId,
          tags: tag,
          description,
          responses: JSON.stringify(responseSchema),
          request_body: JSON.stringify(requestBody),
          parameters: JSON.stringify(parameters),
          api_address: apiAddress
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
      Log.info(`projectid:${projectId}的接口同步成功`);
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
  public async syncData() {
    try {
      const { api_address, project_id, type } = this.ctx.request.body;

      if (!project_id || !api_address || !type) {
        return (this.ctx.body = responseBody(null, 400, '参数错误'));
      }

      const projectModel = getModelInstance<ProjectModel>(ProjectModel);

      const isExist = await projectModel.isExist(project_id);

      if (!isExist) {
        return (this.ctx.body = responseBody(null, 200, 'project_id不存在'));
      }
      const result = await this.syncByPorjectId(project_id, api_address, type);
      if (!result) {
        return (this.ctx.body = responseBody(null, 500, '地址错误'));
      }
      this.ctx.body = responseBody(result, 200, '操作成功');
    } catch (error) {
      Log.error(error);
      if (error.message.indexOf('ENOTFOUND') !== -1) {
        this.ctx.body = responseBody(null, 400, '地址错误');
      } else {
        throw Error(error);
      }
    }
  }

  /**
   * 获取接口列表
   * 包含项目-类目-接口 的树层级
   * @param ctx
   */
  public async list() {
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

        result.push({
          project_id: projectItem.id,
          project_name: projectItem.name,
          desc: projectItem.desc,
          auto_sync: projectItem.auto_sync,
          auto_sync_time: projectItem.auto_sync_time,
          auto_proxy_url: projectItem.auto_proxy_url,
          auto_proxy: projectItem.auto_proxy,
          category_list: catResult,
          type: projectItem.type,
          api_address: projectItem.api_address
        });
      }

      this.ctx.body = responseBody({ list: result }, 200);
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * 获取接口详情
   * @param ctx
   * @returns
   */
  public async detail() {
    const { id } = this.ctx.request.body;

    const result = await this.model.getDetail(id as string);

    if (!result) {
      return (this.ctx.body = responseBody(null, 404, 'id不存在'));
    }

    const data = {
      ...result.toJSON(),
      id: result._id,
      mock_url: `http://${getIPAddress()}:${config.port}/mock/${result.project_id}${result.path}`
    };
    delete data._id;

    this.ctx.body = responseBody(data);
  }

  /**
   * mock功能测试，做接口转发，解决跨域问题
   * @param ctx
   * @returns
   */
  public async operation() {
    try {
      const { body } = this.ctx.request;
      const { api, method } = body;

      if (!api) {
        return (this.ctx.body = responseBody(null, 400, '缺少api'));
      }

      if (!method) {
        return (this.ctx.body = responseBody(null, 400, '缺少method'));
      }

      if (api.indexOf('http') === -1) {
        return (this.ctx.body = responseBody(null, 400, 'api地址错误'));
      }

      const data = await axios({
        method,
        url: api
      });
      this.ctx.body = data.data;
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * edit
   */
  public async edit() {
    try {
      const { body } = this.ctx.request;
      const { id, responses } = body;

      if (!id || !responses) {
        return (this.ctx.body = responseBody(null, 400, '参数不正确'));
      }

      const { content } = JSON.parse(responses);

      if (!content || !content['application/json'] || !content['application/json'].schema) {
        return (this.ctx.body = responseBody(null, 400, 'responses格式不正确'));
      }

      await this.model.updateResponsesById(id, responses);
      return (this.ctx.body = responseBody(null, 200, '操作成功'));
    } catch (error) {
      throw Error(error);
    }
  }

  public async flatlist() {
    try {
      const list = await this.model.getFlatlist();

      return (this.ctx.body = responseBody({ list }, 200, '操作成功'));
    } catch (error) {
      throw Error(error);
    }
  }
}
