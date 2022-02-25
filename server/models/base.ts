import { Document, Model, Schema, SchemaDefinition, model } from 'mongoose';
import AutoIncrement from 'mongoose-auto-increment';
export { SchemaDefinition };

export default abstract class BaseModel<T extends Document> {
  name: string;
  schema: SchemaDefinition;
  model: Model<T>;
  innerSchema: Schema;
  initAutoIncrement: boolean;
  instance: BaseModel<T>;

  constructor() {
    this.name = this.getName();
    this.schema = this.getSchema();
    this.innerSchema = new Schema(this.schema, { collection: this.name });
    this.innerSchema.plugin(AutoIncrement.plugin, {
      model: this.name,
      field: this.getPrimaryKey(),
      startAt: 11
      // incrementBy: yapi.commons.rand(1, 10)
    });

    this.model = model<T>(this.name, this.innerSchema);
  }

  abstract getName(): string;

  abstract getSchema(): SchemaDefinition;

  public getPrimaryKey(): string {
    return '_id';
  }
}
