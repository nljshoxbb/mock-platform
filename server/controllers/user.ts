import BaseController from '@/server/controllers/base';
import UserModel, { UserItem } from '@/server/models/User';
import { Context } from 'koa';
import { isEmpty } from 'lodash';
import { Types } from 'mongoose';

import TokenModel from '../models/token';
import Log from '../utils/Log';
import { generatePasswod, generateToken, getModelInstance, responseBody } from '../utils/utils';

export default class UserController extends BaseController {
  model: UserModel;
  tokenModel: TokenModel;

  constructor(ctx: Context) {
    super(ctx);
    this.model = getModelInstance<UserModel>(UserModel);
    this.tokenModel = getModelInstance<TokenModel>(TokenModel);
  }

  public async login(ctx: Context) {
    try {
      const { username, password } = ctx.request.body;
      if (isEmpty(username) || isEmpty(password)) {
        return (ctx.body = responseBody(null, 400, '请求参数错误'));
      }
      const result = await this.model.get({ username, password: generatePasswod(password).toString() });
      if (result.length === 0) {
        return (ctx.body = responseBody(null, 400, '用户或密码不正确'));
      }

      if (result[0]) {
        const uid = new Types.ObjectId(result[0]._id);
        const token = generateToken(uid);
        await this.tokenModel.update(uid, { uid, token });

        return (ctx.body = responseBody({ username, uid, token }, 200, '登录成功'));
      }
    } catch (error) {
      Log.error(error);
    }
  }

  public async create(ctx: Context) {
    try {
      const { username, password, role, mark } = ctx.request.body;

      if (isEmpty(username) || isEmpty(password) || isEmpty(role)) {
        return (ctx.body = responseBody(null, 400, '请求参数错误'));
      }

      const count = await this.model.checkNameRepeat(username);
      if (count > 0) {
        return (ctx.body = responseBody(null, 400, '用户名重复'));
      }

      const pwd = generatePasswod(password).toString();
      if (pwd) {
        const res = await this.model.create({ username, password: pwd, role, mark });
        return (ctx.body = responseBody({ username, uid: new Types.ObjectId(res._id) }, 200, '操作成功'));
      }
    } catch (error) {
      Log.error(error);
      return (ctx.body = responseBody(null, 500, '系统错误'));
    }
  }

  public async getList(ctx: Context) {
    try {
      const { size = 10, page = 1 } = ctx.request.body;

      const data = await this.model.listWithPaging(page, size);
      const list = data.map((i) => {
        return {
          id: i._id,
          name: i.username,
          mark: i.mark,
          created_at: i.created_at,
          updated_at: i.update_at
        };
      });
      const total = await this.model.listCount();
      return (ctx.body = responseBody({ list, page, size, total }, 200));
    } catch (error) {}
  }

  public async edit(ctx: Context) {
    try {
      const parmas = ctx.request.body;
      const { id } = parmas;
      if (!id) {
        return (ctx.body = responseBody(null, 400, '缺少用户id'));
      }
      const isExist = (await this.model.isExist(id)) as any;
      if (!isExist || (isExist && isExist.soft_del === 1)) {
        return (ctx.body = responseBody(null, 200, 'id不存在'));
      }
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
