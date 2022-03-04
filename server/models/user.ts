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
    return this.model.find({ name }).count();
  }

  public get(data: any = {}) {
    return this.model.find({ ...data, soft_del: { $lte: 0 } }).select('id name desc created_at update_at');
  }

  public update(id: number, item: UserItem) {
    return this.model.findByIdAndUpdate(id, item);
  }

  public remove(id: number) {
    return this.model.findByIdAndUpdate(id, { soft_del: 1 });
  }
}

export default UserModel;
