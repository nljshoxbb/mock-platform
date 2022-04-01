import BaseController from '@/server/controllers/base';
import UserModel from '@/server/models/user';
import { Context } from 'koa';
import { isEmpty } from 'lodash';
import { Types } from 'mongoose';

import TokenModel from '../models/token';
import { generatePasswod, generateToken, getModelInstance, responseBody } from '../utils/utils';

export const DEFAULT_PASSWORD = '123456';

export default class UserController extends BaseController {
  model: UserModel;
  tokenModel: TokenModel;

  constructor(ctx: Context) {
    super(ctx);
    this.model = getModelInstance<UserModel>(UserModel);
    this.tokenModel = getModelInstance<TokenModel>(TokenModel);
  }

  public async login() {
    try {
      const { username, password } = this.ctx.request.body;
      if (isEmpty(username) || isEmpty(password)) {
        return (this.ctx.body = responseBody(null, 400, '请求参数错误'));
      }

      const userResult = await this.model.get({ username });
      if (isEmpty(userResult)) {
        return (this.ctx.body = responseBody(null, 404, '用户不存在'));
      }

      const result = await this.model.get({ username, password: generatePasswod(password).toString() });

      if (result.length === 0) {
        return (this.ctx.body = responseBody(null, 400, '用户或密码不正确'));
      }

      if (result[0]) {
        const uid = new Types.ObjectId(result[0]._id);
        const token = generateToken(uid);
        await this.tokenModel.update(uid, { uid, token });

        return (this.ctx.body = responseBody({ username, uid, token }, 200, '登录成功'));
      }
    } catch (error) {
      throw Error(error);
    }
  }

  public async create() {
    try {
      const { username, password = DEFAULT_PASSWORD, role, mark } = this.ctx.request.body;
      if (!username || !password || !role) {
        return (this.ctx.body = responseBody(null, 400, '请求参数错误'));
      }

      const count = await this.model.checkNameRepeat(username);
      if (count > 0) {
        return (this.ctx.body = responseBody(null, 400, '用户名重复'));
      }

      const pwd = generatePasswod(password).toString();
      if (pwd) {
        const res = await this.model.create({ username, password: pwd, role, mark });
        return (this.ctx.body = responseBody({ username, uid: new Types.ObjectId(res._id) }, 200, '操作成功'));
      }
    } catch (error) {
      throw Error(error);
    }
  }

  public async getList() {
    try {
      const { size = 10, page = 1 } = this.ctx.request.body;

      const data = await this.model.listWithPaging(page, size);
      const list = data.map((i) => {
        return {
          id: i._id,
          username: i.username,
          mark: i.mark,
          created_at: i.created_at,
          update_at: i.update_at,
          role: i.role
        };
      });
      const total = await this.model.listCount();
      return (this.ctx.body = responseBody({ list, page, size, total }, 200));
    } catch (error) {
      throw Error(error);
    }
  }

  public async edit() {
    try {
      const parmas = this.ctx.request.body;
      const { id } = parmas;
      if (!id) {
        return (this.ctx.body = responseBody(null, 400, '缺少用户id'));
      }
      const isExist = (await this.model.isExist(id)) as any;
      if (!isExist || (isExist && isExist.soft_del === 1)) {
        return (this.ctx.body = responseBody(null, 400, 'id不存在'));
      }
    } catch (error) {
      throw Error(error);
    }
  }

  public async remove() {
    try {
      const { id } = this.ctx.request.body;

      const isExist = await this.model.isExist(id);
      if (!isExist) {
        return (this.ctx.body = responseBody(null, 400, 'id不存在'));
      }

      if (isExist.role === '0') {
        return (this.ctx.body = responseBody(null, 400, '此账号无法删除'));
      }

      /** 删除成功后，token也需要删除 */
      await this.model.remove(id);
      await this.tokenModel.removeByUid(id);

      this.ctx.body = responseBody(null, 200, '操作成功');
    } catch (error) {
      throw Error(error);
    }
  }

  public async resetPwd() {
    try {
      const { uid } = this.ctx.request.body;

      if (!uid) {
        return (this.ctx.body = responseBody(null, 400, '缺少uid'));
      }

      const isExit = this.model.isExist(uid);

      if (!isExit) {
        return (this.ctx.body = responseBody(null, 400, '用户不存在'));
      }

      await this.model.changePwd(uid, generatePasswod(DEFAULT_PASSWORD));
      /** 成功后退出登录 */
      await this.tokenModel.removeByUid(uid);

      this.ctx.body = responseBody({}, 200, '操作成功');
    } catch (error) {
      throw Error(error);
    }
  }

  public async changepwd() {
    try {
      const { uid, new_pwd, old_pwd } = this.ctx.request.body;

      const isExit = await this.model.isExist(uid);

      if (!isExit) {
        return (this.ctx.body = responseBody(null, 404, '用户不存在'));
      }

      await this.model.changePwd(uid, generatePasswod(new_pwd));

      /** 成功后退出登录 */
      await this.tokenModel.removeByUid(uid);

      this.ctx.body = responseBody({}, 200, '操作成功');
    } catch (error) {
      throw Error(error);
    }
  }
}
