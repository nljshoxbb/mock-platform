import { Document } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface InterfaceItem extends CommonSchema {
  path: string;
  method: string;
  project_id: number;

  responses: string;
  request_body: string;
  parameters: string;
  tags: string;

  mark?: string;
  description?: string;
  category_id?: string;
}

export interface InterfaceModelI extends InterfaceItem, Document {}

class InterfaceModel extends BaseModel<InterfaceModelI> {
  getName(): string {
    return 'interface';
  }

  getSchema(): SchemaDefinition {
    return {
      path: { required: true, type: String },
      method: { required: true, type: String },
      project_id: { required: true, type: Number },
      category_id: { required: true, type: Number },

      responses: { required: false, type: String },
      request_body: { required: false, type: String },
      parameters: { required: false, type: String },
      tags: { required: true, type: String },

      mark: { required: false, type: String },
      description: { required: false, type: String },
      ...this.commonSchema
    };
  }

  public async create(data: InterfaceItem[]) {
    return await this.model.create(data);
  }

  public get(params: any) {
    return this.model.find({});
  }

  public isExit(id: number) {
    return this.model.findById(id);
  }

  public updateById(id: number, item: InterfaceItem) {
    return this.model.findByIdAndUpdate(id, item);
  }

  public updateManyByFilter(item: InterfaceItem[], filter) {
    return this.model.updateMany(filter, item, { upsert: true });
  }

  public remove(id: number) {
    return this.model.findByIdAndUpdate(id, { soft_del: 1 });
  }
}

export default InterfaceModel;
