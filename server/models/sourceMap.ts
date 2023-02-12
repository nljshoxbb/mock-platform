import { Document } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface SourceMapItem extends CommonSchema {
  // type: 'user' | 'project' | 'interface' | 'expected';
  content: string;
  version: string;
  file: string;
  project: string;
  buildNumber: number;
}

export interface SourceMapModelI extends SourceMapItem, Document {}

class SourceMapModel extends BaseModel<SourceMapModelI> {
  getName(): string {
    return 'sourceMap';
  }

  getSchema(): SchemaDefinition {
    return {
      content: { required: true, type: String },
      version: { required: true, type: String },
      file: { required: true, type: String },
      project: { required: true, type: String },
      buildNumber: { required: true, type: String },
      ...this.commonSchema
    };
  }

  public async create(data: SourceMapItem) {
    return await this.model.create({ ...data, soft_del: 0 });
  }

  public count(data: any = {}) {
    return this.model.count({ ...data, soft_del: { $lte: 0 } });
  }

  public get(data: any = {}) {
    return this.model.find({ ...data, soft_del: { $lte: 0 } }).select('id version content project buildNumber file created_at update_at  ');
  }
}

export default SourceMapModel;
