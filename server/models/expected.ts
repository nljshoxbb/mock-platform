import { Document } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface ExpectedItem extends CommonSchema {
  name: string;
  interface_id: string;
  response_body: string;
  delay: number;
  desc?: string;
}

export interface ExpectedModelI extends ExpectedItem, Document {}

class ExpectedModel extends BaseModel<ExpectedModelI> {
  getName(): string {
    return 'expected';
  }

  getSchema(): SchemaDefinition {
    return {
      name: { required: true, type: String },
      interface_id: { required: true, type: String },
      response_body: { required: true, type: String },
      delay: { required: true, type: String },
      desc: { required: false, type: String },
      ...this.commonSchema
    };
  }

  public async create(data: ExpectedItem) {
    return await this.model.create({ ...data, soft_del: 0 });
  }

  public checkNameRepeat(name) {
    return this.model.find({ name, soft_del: { $lte: 0 } }).count();
  }

  public get(data: any = {}) {
    return this.model.find({ ...data, soft_del: { $lte: 0 } }).select('id name desc response_body delay created_at update_at');
  }

  public update(id: number, item: ExpectedItem) {
    return this.model.findByIdAndUpdate(id, item);
  }

  public remove(id: number) {
    return this.model.findByIdAndUpdate(id, { soft_del: 1 });
  }
}

export default ExpectedModel;
