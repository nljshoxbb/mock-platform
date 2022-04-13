import { Document, Schema } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface InterfaceItem extends CommonSchema {
  path: string;
  method: string;
  project_id: string;

  responses: string;
  request_body: string;
  parameters: string;
  tags: string;

  mark?: string;
  description?: string;
  category_id?: string;
  api_address: string;
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
      project_id: { required: true, type: String },
      category_id: { required: true, type: String },

      responses: { required: false, type: String },
      request_body: { required: false, type: String },
      parameters: { required: false, type: String },
      tags: { required: true, type: String },
      api_address: { required: true, type: String },
      mark: { required: false, type: String },
      description: { required: false, type: String },
      ...this.commonSchema
    };
  }

  public async get(params: Partial<InterfaceItem> = {}, select: string = 'method name _id  description path  ') {
    return this.model.find(params).select(select).exec();
  }

  public async getDetail(id: string) {
    return this.model.findById(id).exec();
  }

  public async getDataByPath(projectId, method, path) {
    return this.model.find({ project_id: projectId, method, path }).lean();
  }

  public async updateResponsesById(id, schema) {
    return this.model.findByIdAndUpdate(id, { responses: schema });
  }

  public async getFlatlist() {
    return this.model.find().select('id path project_id category_id').exec();
  }
}

export default InterfaceModel;
