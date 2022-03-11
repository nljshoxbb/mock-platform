import BaseController from '@/server/controllers/base';
import ExpectedModel, { ExpectedItem } from '@/server/models/expected';
import { Context } from 'koa';
import { isEmpty } from 'lodash';

import { getModelInstance, responseBody } from '../utils/utils';

export default class ExpectedController extends BaseController {
  model: ExpectedModel;

  constructor(ctx: Context) {
    super(ctx);
    this.model = getModelInstance<ExpectedModel>(ExpectedModel);
  }

  public async create() {
    try {
      const { name, interface_id, response_body, delay, desc } = this.ctx.request.body;
      const data: ExpectedItem = {
        name,
        interface_id,
        response_body,
        delay: delay || 0,
        desc: desc,
        status: true
      };

      if (isEmpty(name) || isEmpty(interface_id) || isEmpty(response_body)) {
        return (this.ctx.body = responseBody(null, 400, '参数错误'));
      }

      const count = await this.model.checkNameRepeat(name);

      if (count > 0) {
        return (this.ctx.body = responseBody(null, 400, '已存在'));
      }

      /** 批量关闭其他期望 */

      await this.model.updateAllStatus(interface_id);

      await this.model.create(data);

      return (this.ctx.body = responseBody(null, 200, '成功'));
    } catch (error) {
      throw Error(error);
    }
  }

  public async getList() {
    try {
      const { size = 10, page = 1, interface_id } = this.ctx.request.body;
      if (!interface_id) {
        return (this.ctx.body = responseBody(null, 400, '缺少interface_id'));
      }

      const list = await this.model.listWithPaging(interface_id, page, size);
      const total = await this.model.listCount(interface_id);

      return (this.ctx.body = responseBody(
        {
          list: list.map((i) => {
            return {
              id: i._id,
              name: i.name,
              response_body: i.response_body,
              delay: i.delay,
              desc: i.desc,
              created_at: i.created_at,
              updated_at: i.update_at,
              status: i.status
            };
          }),
          total,
          size,
          page
        },
        200
      ));
    } catch (error) {
      throw Error(error);
    }
  }

  public async edit() {
    try {
      const parmas = this.ctx.request.body;
      const { id, name, desc, response_body, delay } = parmas;
      if (!id) {
        return (this.ctx.body = responseBody(null, 400, '参数不正确'));
      }
      const isExist = await this.model.isExist(id);
      if (!isExist) {
        return (this.ctx.body = responseBody(null, 400, 'id不存在'));
      }

      await this.model.update(id, { name, desc, response_body, delay, status: isExist.status });
      this.ctx.body = responseBody(null, 200, '更新成功');
    } catch (error) {
      throw Error(error);
    }
  }

  public async remove() {
    try {
      const { id } = this.ctx.request.body;
      const isExist = await this.model.isExist(id);
      if (!isExist) {
        return (this.ctx.body = responseBody(null, 200, 'id不存在'));
      }
      await this.model.remove(id);
      this.ctx.body = responseBody(null, 200, '操作成功');
    } catch (error) {
      throw Error(error);
    }
  }

  public async updateStatus() {
    try {
      const { id, status } = this.ctx.request.body;
      const isExist = await this.model.isExist(id);
      if (!isExist) {
        return (this.ctx.body = responseBody(null, 200, 'id不存在'));
      }

      if (status) {
        await this.model.updateAllStatus(isExist.interface_id);
      }
      await this.model.update(id, {
        name: isExist.name,
        desc: isExist.desc,
        response_body: isExist.response_body,
        delay: isExist.delay,
        status
      });
      this.ctx.body = responseBody(null, 200, '操作成功');
    } catch (error) {
      throw Error(error);
    }
  }
}
