import { Document } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface UserItem extends CommonSchema {
  username: string;
  password: string;
  role: string;
  mark?: string;
}

export interface UserModelI extends UserItem, Document {}

class UserModel extends BaseModel<UserModelI> {
  getName(): string {
    return 'user';
  }

  getSchema(): SchemaDefinition {
    return {
      username: { required: true, type: String },
      password: { required: true, type: String },
      role: { required: true, type: String },
      mark: String,
      ...this.commonSchema
    };
  }

  public async create(data: UserItem) {
    return await this.model.create({ ...data, soft_del: 0 });
  }

  public checkNameRepeat(name) {
    return this.model.find({ username: name }).count();
  }

  public get(data: any = {}) {
    return this.model.find({ ...data, soft_del: { $lte: 0 } }).select('username mark created_at update_at');
  }

  public update(id: number, item: Omit<UserItem, 'password' | 'username'>) {
    return this.model.findByIdAndUpdate(id, item);
  }

  public changePwd(id: number, password: string) {
    return this.model.findByIdAndUpdate(id, { password });
  }

  public remove(id: number) {
    return this.model.findByIdAndUpdate(id, { soft_del: 1 });
  }

  public async listWithPaging(page, limit, data) {
    const { username, begin, end } = data;
    page = parseInt(page);
    limit = parseInt(limit);

    const usernameReg = new RegExp(`${username}`, 'i');

    const obj: any = {
      soft_del: { $lte: 0 },
      username: { $regex: usernameReg }
    };

    if (begin && end) {
      obj.created_at = {
        $gte: begin,
        $lt: end
      };
    }

    return this.model
      .find(obj)
      .sort([['_id', -1]])
      .skip((page - 1) * limit)
      .limit(limit)
      .select('_id username role type  created_at update_at mark')
      .exec();
  }

  /**
   * listCount
   */
  public async listCount(data: any) {
    const { username, begin, end } = data;

    const usernameReg = new RegExp(`${username}`, 'i');

    const obj: any = {
      soft_del: { $lte: 0 }
    };

    if (username) {
      obj.username = {
        $regex: usernameReg
      };
    }

    if (begin && end) {
      obj.created_at = {
        $gte: begin,
        $lt: end
      };
    }

    if (username || begin || end) {
      const res = await this.model.find(obj);
      return res.length;
    }
    return this.model.countDocuments();
  }
}

export default UserModel;
