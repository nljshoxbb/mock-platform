import { Document } from 'mongoose';

import BaseModel, { SchemaDefinition } from './base';

export interface ProjectItem {
  name: string;
  description?: string;
}

export interface ProjectModelI extends ProjectItem, Document {
  createTime: Date;
}

class ProjectModel extends BaseModel<ProjectModelI> {
  getName(): string {
    return 'project';
  }

  getSchema(): SchemaDefinition {
    return {
      name: { required: true, type: String },
      description: { required: false, type: String }
    };
  }

  public async create(data: ProjectItem) {
    return await this.model.create(data);
  }

  public checkNameRepeat(name) {
    return this.model.find({ name }).count();
  }
}

export default ProjectModel;
