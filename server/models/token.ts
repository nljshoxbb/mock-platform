import { Document } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface TokenItem extends CommonSchema {
  name: string;
  desc?: string;
}

export interface TokenModelI extends TokenItem, Document {}

class TokenModel extends BaseModel<TokenModelI> {
  getName(): string {
    return 'token';
  }

  getSchema(): SchemaDefinition {
    return {
      project_id: { required: true, type: String },
      token: { reqiured: true, type: String },
      ...this.commonSchema
    };
  }

  public get(data: any = {}) {
    return this.model.find({ ...data });
  }
}

export default TokenModel;
