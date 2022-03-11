import { Document } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface TokenItem extends CommonSchema {
  token: string;
  uid: string;
}

export interface TokenModelI extends TokenItem, Document {}

class TokenModel extends BaseModel<TokenModelI> {
  getName(): string {
    return 'token';
  }

  getSchema(): SchemaDefinition {
    return {
      uid: { required: true, type: String },
      token: { reqiured: true, type: String },
      ...this.commonSchema
    };
  }

  public get(data: any = {}) {
    return this.model.find({ ...data });
  }

  public update(uid, data) {
    return this.model.updateOne({ uid }, data, { upsert: true });
  }

  public removeByUid(id) {
    return this.model.remove({ uid: id });
  }
}

export default TokenModel;
