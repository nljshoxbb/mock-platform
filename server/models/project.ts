import { Document } from 'mongoose';

import BaseModel, { SchemaDefinition } from './base';

export interface ProjectItem {
  name: string;
  desc?: string;
  created_at?: number;
  update_at?: number;
  soft_del?: number;
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
      created_at: { required: false, type: Number },
      update_at: { required: false, type: Number },
      soft_del: { required: false, type: Number }
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
