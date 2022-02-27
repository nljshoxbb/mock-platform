import ProjectModel, { ProjectItem } from '@/server/models/project';
import { Context } from 'koa';

import { getModelInstance, responseBody } from '../utils/utils';

export const Create = async (ctx: Context) => {
  try {
    const params = ctx.request.body;
    const data: ProjectItem = {
      name: params.name
    };

    const model = getModelInstance<ProjectModel>(ProjectModel);
    const count = await model.checkNameRepeat(params.name);

    if (count > 0) {
      return (ctx.body = responseBody(null, 400, '项目名重复'));
    }

    await model.create(data);
    return (ctx.body = responseBody(null, 200, '成功'));
  } catch (error) {
    console.log(error.errors);
    return (ctx.body = responseBody(null, 500, '系统错误'));
  }
};

export const Find = async (ctx: Context) => {
  return 2222;
};
