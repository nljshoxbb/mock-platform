import { Document } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface CategoryItem extends CommonSchema {
  project_id: string;
  name: number;
  apis: string[];
}

export interface CategoryModelI extends CategoryItem, Document {}

class CategoryModel extends BaseModel<CategoryModelI> {
  getName(): string {
    return 'category';
  }

  getSchema(): SchemaDefinition {
    return {
      project_id: { required: true, type: String },
      name: { required: true, type: String },
      ...this.commonSchema
    };
  }

  public async get(params: Partial<CategoryItem> = {}, select: string = 'name project_id _id') {
    return this.model.find(params).lean().select('name project_id _id').exec();
  }

  public isExitByName(names: string[]) {
    return this.model.find({ name: names });
  }
}

export default CategoryModel;
