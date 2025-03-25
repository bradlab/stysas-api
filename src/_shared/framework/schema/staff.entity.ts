import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PersonEntity } from './person.schema';
import { Staff } from 'domain/model/staff.model';

export type StafftDocument = HydratedDocument<StaffEntity>;

@Schema()
export class StaffEntity extends PersonEntity implements Staff{
  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  code: string;
}

export const StaffSchema = SchemaFactory.createForClass(StaffEntity);
