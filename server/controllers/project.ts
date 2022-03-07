import BaseController from '@/server/controllers/base';
import ProjectModel, { ProjectItem } from '@/server/models/project';
import { Context } from 'koa';
import { isEmpty } from 'lodash';

import InterfaceModel from '../models/interface';
import Log from '../utils/Log';
import { getModelInstance, objectIdToString, responseBody } from '../utils/utils';
import InterfaceController from './interface';

export default class ProjectController extends BaseController {
  model: ProjectModel;
  interfaceMode: InterfaceModel;
  constructor(ctx: Context) {
    super(ctx);
    this.model = getModelInstance<ProjectModel>(ProjectModel);
    this.interfaceMode = getModelInstance<InterfaceModel>(InterfaceModel);
  }

  public async create(ctx: Context) {
    try {
      const { name, desc, api_address, type } = ctx.request.body;
      const data: ProjectItem = {
        name,
        desc
      };

      const interfaceController = new InterfaceController(ctx);

      const count = await this.model.checkNameRepeat(name);
      if (isEmpty(name) || isEmpty(api_address) || isEmpty(type)) {
        return (ctx.body = responseBody(null, 400, '参数错误'));
      }

      if (count > 0) {
        return (ctx.body = responseBody(null, 400, '项目名重复'));
      }
      const res = await this.model.create(data);
      if (res) {
        await interfaceController.syncByPorjectId(objectIdToString(res._id), api_address, type);
      }

      return (ctx.body = responseBody(null, 200, '成功'));
    } catch (error) {
      Log.error(error);
      return (ctx.body = responseBody(null, 500, '系统错误'));
    }
  }

  public async getList(ctx: Context) {
    try {
      const params = ctx.request.body;

      const data = await this.model.get(params);
      const list = data.map((i) => {
        return {
          id: i._id,
          name: i.name,
          desc: i.desc,
          soft_del: i.soft_del,
          created_at: i.created_at,
          updated_at: i.update_at
        };
      });
      return (ctx.body = responseBody(list, 200));
    } catch (error) {}
  }

  public async edit(ctx: Context) {
    try {
      const parmas = ctx.request.body;
      const { id } = parmas;

      if (!id) {
        return (ctx.body = responseBody(null, 400, '缺少id'));
      }

      const isExist = await this.model.isExist(id);

      if (!isExist) {
        return (ctx.body = responseBody(null, 200, 'id不存在'));
      }

      await this.model.update(id, { name: parmas.name, desc: parmas.desc });
      ctx.body = responseBody(null, 200, '更新成功');
    } catch (error) {
      console.log(error);
    }
  }

  public async remove(ctx: Context) {
    try {
      const { id } = ctx.request.body;

      const isExist = await this.model.isExist(id);
      if (!isExist) {
        return (ctx.body = responseBody(null, 200, 'id不存在'));
      }
      await this.model.remove(id);
      ctx.body = responseBody(null, 200, '操作成功');
    } catch (error) {
      console.log(error);
    }
  }
}
