import { Document } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface ProjectItem extends CommonSchema {
  name: string;
  desc?: string;
}

export interface ProjectModelI extends ProjectItem, Document {}

class ProjectModel extends BaseModel<ProjectModelI> {
  getName(): string {
    return 'project';
  }

  getSchema(): SchemaDefinition {
    return {
      name: { required: true, type: String },
      desc: { required: false, type: String },
      ...this.commonSchema
    };
  }

  public async create(data: ProjectItem) {
    return await this.model.create({ ...data });
  }

  public checkNameRepeat(name) {
    return this.model.find({ name }).count();
  }

  public get(params: any) {
    return this.model.find({});
  }

  public isExit(id: number) {
    return this.model.findById(id);
  }

  public update(id: number, item: ProjectItem) {
    return this.model.findByIdAndUpdate(id, item);
  }

  public remove(id: number) {
    return this.model.findByIdAndUpdate(id, { soft_del: 1 });
  }
}

export default ProjectModel;
