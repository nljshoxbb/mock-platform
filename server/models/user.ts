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

  public remove(id: number) {
    return this.model.findByIdAndUpdate(id, { soft_del: 1 });
  }

  public async listWithPaging(page, limit) {
    page = parseInt(page);
    limit = parseInt(limit);
    return this.model
      .find()
      .sort({ soft_del: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('_id username email role type  add_time up_time study')
      .exec();
  }

  /**
   * listCount
   */
  public listCount() {
    return this.model.countDocuments();
  }
}

export default UserModel;
