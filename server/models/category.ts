import { Document } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface CategoryItem extends CommonSchema {
  project_id: number;
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
      project_id: { required: true, type: Number },
      name: { required: true, type: String },
      ...this.commonSchema
    };
  }

  public async create(data: CategoryItem[]) {
    return await this.model.create(data);
  }

  public get() {
    return this.model.find({});
  }

  public isExit(id: number) {
    return this.model.findById(id);
  }

  public isExitByName(names: string[]) {
    return this.model.find({ name: names });
  }

  public update(id: number, item: CategoryItem) {
    return this.model.findByIdAndUpdate(id, item);
  }

  public remove(id: number) {
    return this.model.findByIdAndUpdate(id, { soft_del: 1 });
  }
}

export default CategoryModel;
