import { Document } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface LogItem extends CommonSchema {
  type: 'user' | 'project' | 'interface' | 'expected';
  content: string;
  username: string;
  uid: string;
}

export interface LogModelI extends LogItem, Document {}

class LogModel extends BaseModel<LogModelI> {
  getName(): string {
    return 'log';
  }

  getSchema(): SchemaDefinition {
    return {
      type: { type: String, enum: ['user', 'project', 'interface', 'expected'] },
      ...this.commonSchema
    };
  }

  public async create(data: LogItem) {
    return await this.model.create({ ...data, soft_del: 0 });
  }
}

export default LogModel;
