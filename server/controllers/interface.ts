import InterfaceModel, { InterfaceItem } from '@/server/models/interface';
import Log from '@/server/utils/Log';
import SwaggerParser from '@apidevtools/swagger-parser';
import axios from 'axios';
import { Context } from 'koa';
import yamljs from 'yamljs';

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
  interfaceModel: InterfaceModel;
  constructor(ctx: Context) {
    super(ctx);
    this.model = getModelInstance<InterfaceModel>(InterfaceModel);
    this.categoryModel = getModelInstance<CategoryModel>(CategoryModel);
  }

  public async syncData(ctx: Context) {
    try {
      const { api, project_id } = ctx.request.body;

      if (!project_id) {
        return (ctx.body = responseBody(null, 400, '缺少project_id'));
      }

      const res = await axios.get(api);

      const projectModel = getModelInstance<ProjectModel>(ProjectModel);

      const isExit = await projectModel.isExit(project_id);

      if (!isExit) {
        return (ctx.body = responseBody(null, 200, 'project_id不存在'));
      }

      if (res.status === 200 && res.data) {
        const jsonData = yamljs.parse(res.data);
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
            project_id
          };

          Object.keys(responses).forEach((k) => {
            if (k === '200') {
              responseSchema = getSchema(responses[k]);
            }
          });

          interfaceBatchUpdate.push({
            path: i,
            method,
            project_id,
            tags: tag,
            description,
            responses: JSON.stringify(responseSchema),
            request_body: JSON.stringify(requestBody),
            parameters: JSON.stringify(parameters)
          });
        });

        /** category去重处理 */
        const catArr = Object.keys(categoryMap).map((i) => categoryMap[i]);
        const currentCategory = await this.categoryModel.get();
        const catName = currentCategory.map((i) => i.name);
        const newCategory = catArr.filter((i) => !catName.includes(i.name));

        let result;

        if (newCategory.length > 0) {
          result = await this.categoryModel.create(catArr);
          const categoryNameIdMap = {};
          if (result) {
            result.forEach((i) => {
              categoryNameIdMap[i.name] = i._id;
            });
          }
        }

        /** category_id 赋值 */
        const nowCategory = await this.categoryModel.get();

        const nowCategoryMap = {};
        nowCategory.forEach((i) => {
          nowCategoryMap[i.name] = i._id;
        });

        interfaceBatchUpdate.forEach((i) => {
          if (nowCategoryMap[i.tags]) {
            i.category_id = nowCategoryMap[i.tags];
          }
        });

        /** 接口去重，覆盖处理 */
        // this.model.ge

        // await this.model.updateManyByFilter(interfaceBatchUpdate, {
        //   // project_id
        //   // path: pathArr
        // });

        ctx.body = responseBody(null, 200, '操作成功');
      }
    } catch (error) {
      Log.error(error.message);
    }
  }
}
