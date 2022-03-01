import ProjectModel, { ProjectItem } from '@/server/models/project';
import { Context } from 'koa';

import Log from '../utils/Log';
import { getModelInstance, responseBody } from '../utils/utils';

export const Create = async (ctx: Context) => {
  try {
    const params = ctx.request.body;
    const data: ProjectItem = {
      name: params.name
    };

    const model = getModelInstance<ProjectModel>(ProjectModel);
    const count = await model.checkNameRepeat(params.name);

    if (!data.name) {
      return (ctx.body = responseBody(null, 400, '缺少参数name'));
    }

    if (count > 0) {
      return (ctx.body = responseBody(null, 400, '项目名重复'));
    }
    await model.create(data);
    return (ctx.body = responseBody(null, 200, '成功'));
  } catch (error) {
    Log.error(error);
    return (ctx.body = responseBody(null, 500, '系统错误'));
  }
};

export const List = async (ctx: Context) => {
  try {
    const params = ctx.request.query;
    const model = getModelInstance<ProjectModel>(ProjectModel);
    const data = await model.get(params);
    const list = data
      .map((i) => {
        return {
          id: i._id,
          name: i.name,
          desc: i.desc,
          soft_del: i.soft_del,
          created_at: i.created_at,
          updated_at: i.update_at
        };
      })
      .filter((i) => !i.soft_del);
    return (ctx.body = responseBody(list, 200));
  } catch (error) {}
};

export const Edit = async (ctx: Context) => {
  try {
    const parmas = ctx.request.body;
    const { id } = parmas;

    if (!id) {
      return (ctx.body = responseBody(null, 400, '缺少id'));
    }
    const model = getModelInstance<ProjectModel>(ProjectModel);

    const isExit = await model.isExit(id);

    if (!isExit) {
      return (ctx.body = responseBody(null, 200, 'id不存在'));
    }

    await model.update(id, { name: parmas.name, desc: parmas.desc });

    return (ctx.body = responseBody(null, 200, '更新成功'));
  } catch (error) {}
};

export const Delete = async (ctx: Context) => {
  try {
    const { id } = ctx.request.body;
    const model = getModelInstance<ProjectModel>(ProjectModel);

    const isExit = await model.isExit(id);
    if (!isExit) {
      return (ctx.body = responseBody(null, 200, 'id不存在'));
    }
    await model.remove(id);
    ctx.body = responseBody(null, 200, '操作成功');
  } catch (error) {
    console.log(error);
  }
};
