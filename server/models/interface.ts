import { Document } from 'mongoose';

import BaseModel, { SchemaDefinition } from './base';

export interface InterfaceItem {
  path: string;
  method: string;
  mark?: string;
  created_at?: number;
  update_at?: number;
  soft_del?: number;
  response_raw: string;
  request_raw: string;
}

export interface InterfaceModelI extends InterfaceItem, Document {}

class InterfaceModel extends BaseModel<InterfaceModelI> {
  getName(): string {
    return 'interface';
  }

  getSchema(): SchemaDefinition {
    return {
      path: { required: true, type: String },
      mark: { required: false, type: String },
      created_at: { required: false, type: Number },
      update_at: { required: false, type: Number },
      soft_del: { required: false, type: Number },
      response_raw: { required: false, type: String },
      request_raw: { required: false, type: String }
    };
  }

  public async create(data: InterfaceItem) {
    return await this.model.create({ ...data });
  }

  public get(params: any) {
    return this.model.find({});
  }

  public isExit(id: number) {
    return this.model.findById(id);
  }

  public update(id: number, item: InterfaceItem) {
    return this.model.findByIdAndUpdate(id, item);
  }

  public remove(id: number) {
    return this.model.findByIdAndUpdate(id, { soft_del: 1 });
  }
}

export default InterfaceModel;
