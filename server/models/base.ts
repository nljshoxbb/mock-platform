import { Document, Model, Schema, SchemaDefinition, Types, model } from 'mongoose';
import AutoIncrement from 'mongoose-auto-increment';
export { SchemaDefinition };

export interface CommonSchema {
  created_at?: number;
  update_at?: number;
  soft_del?: number;
}

export default abstract class BaseModel<T extends Document> {
  name: string;
  schema: SchemaDefinition;
  model: Model<T>;
  innerSchema: Schema;
  initAutoIncrement: boolean;
  instance: BaseModel<T>;
  commonSchema: SchemaDefinition = {
    created_at: { required: false, type: Number },
    update_at: { required: false, type: Number },
    soft_del: { required: false, type: Number }
  };

  constructor() {
    this.name = this.getName();
    this.schema = this.getSchema();
    this.innerSchema = new Schema(this.schema, {
      collection: this.name,
      timestamps: {
        createdAt: 'created_at',
        currentTime: () => Math.floor(Date.now() / 1000),
        updatedAt: 'update_at'
      }
    });
    // this.innerSchema.plugin(AutoIncrement.plugin, {
    //   model: this.name,
    //   field: this.getPrimaryKey(),
    //   startAt: 1
    // });

    this.model = model<T>(this.name, this.innerSchema);
  }

  abstract getName(): string;

  abstract getSchema(): SchemaDefinition;

  public getPrimaryKey(): string {
    return '_id';
  }

  public async bulkWrite(opt: any[]) {
    return this.model.bulkWrite(opt);
  }

  public toObjectId(id: string | number) {
    return new Types.ObjectId(id);
  }

  public isExist(id: any) {
    if (Types.ObjectId.isValid(id)) {
      return this.model.findById(this.toObjectId(id));
    }
    return false;
  }
}
