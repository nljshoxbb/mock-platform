import { Document } from 'mongoose';

import BaseModel, { CommonSchema, SchemaDefinition } from './base';

export interface ProjectItem extends CommonSchema {
  name: string;
  desc?: string;
  uid: string;
  api_address: string;
  auto_sync?: boolean;
  auto_sync_time?: number;
  type: string;
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
      uid: { required: true, type: String },
      api_address: { required: true, type: String },
      auto_sync: { required: false, type: Boolean },
      auto_sync_time: { required: false, type: Number },
      type: { required: true, type: String },
      ...this.commonSchema
    };
  }

  public async create(data: ProjectItem) {
    return await this.model.create({ ...data, soft_del: 0 });
  }

  public checkNameRepeat(name, uid) {
    return this.model.find({ name, uid, soft_del: { $lte: 0 } }).count();
  }

  public get(data: any = {}) {
    return this.model.find({ ...data, soft_del: { $lte: 0 } }).select('id name desc created_at update_at auto_sync auto_sync_time api_address type');
  }

  public update(id: number, item: ProjectItem) {
    return this.model.findByIdAndUpdate(id, item);
  }

  public remove(id: number) {
    return this.model.findByIdAndUpdate(id, { soft_del: 1 });
  }
}

export default ProjectModel;
