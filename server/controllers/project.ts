import ProjectModel, { ProjectItem, ProjectModelI } from '@/server/models/project';
import { Context } from 'koa';

import { getModelInstance } from '../utils/utils';

export const Create = async (ctx: Context) => {
  try {
    const params = ctx.request.body;
    // console.log(params);
    const data: ProjectItem = {
      name: params.name
    };

    const model = getModelInstance<ProjectModel>(ProjectModel);
    // a.checkNameRepeat(0)
    // console.log(params.name, model.checkNameRepeat(params.name));
    const count = await model.checkNameRepeat(params.name);
    console.log(count);

    if (count > 0) {
      ctx.body = {
        data: null,
        status: 'fail',
        hasError: true
      };
      return;
    }
    // model.checkNameRepeat(params.name);
    // if (model.checkNameRepeat(params.name) > 0) {
    //   return;
    // }
    const res = await model.create(data);
    ctx.status = 400;
    ctx.body = {
      data: new Date(),
      status: 'success',
      hasError: false
    };
  } catch (error) {
    console.log(error);
  }
};

export const Find = async (ctx: Context) => {
  return 2222;
};
