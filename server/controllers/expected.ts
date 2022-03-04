import BaseController from '@/server/controllers/base';
import ExpectedModel, { ExpectedItem } from '@/server/models/expected';
import { Context } from 'koa';
import { isEmpty } from 'lodash';

import Log from '../utils/Log';
import { getModelInstance, responseBody } from '../utils/utils';

export default class ExpectedController extends BaseController {
  model: ExpectedModel;

  constructor(ctx: Context) {
    super(ctx);
    this.model = getModelInstance<ExpectedModel>(ExpectedModel);
  }

  public async create(ctx: Context) {
    try {
      const { name, interface_id, response_body, delay, desc } = ctx.request.body;
      const data: ExpectedItem = {
        name,
        interface_id,
        response_body,
        delay: delay || 0,
        desc: desc
      };
      if (isEmpty(name) || isEmpty(interface_id) || isEmpty(response_body)) {
        return (ctx.body = responseBody(null, 400, '参数错误'));
      }

      const count = await this.model.checkNameRepeat(name);

      if (count > 0) {
        return (ctx.body = responseBody(null, 400, '已存在'));
      }

      await this.model.create(data);
      return (ctx.body = responseBody(null, 200, '成功'));
    } catch (error) {
      Log.error(error);
      return (ctx.body = responseBody(null, 500, '系统错误'));
    }
  }

  public async getList(ctx: Context) {
    try {
      const params = ctx.request.query;

      const data = await this.model.get(params);
      const list = data.map((i) => {
        return {
          id: i._id,
          name: i.name,
          response_body: i.response_body,
          interface_id: i.interface_id,
          delay: i.delay,
          desc: i.desc,
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
      const { id, name, desc, response_body, delay, interface_id } = parmas;
      if (!id) {
        return (ctx.body = responseBody(null, 400, '参数不正确'));
      }
      const isExist = await this.model.isExist(id);
      if (!isExist) {
        return (ctx.body = responseBody(null, 200, 'id不存在'));
      }
      await this.model.update(id, { name, desc, response_body, delay, interface_id });
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
