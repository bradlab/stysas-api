import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Person } from 'domain/interface/person.model';
import { ATimestamp } from 'framework/timestamp.abstract';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type PersonDocument = HydratedDocument<PersonEntity>;

@Schema()
export class PersonEntity extends ATimestamp implements Person {

  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  id: string;

  @Prop({ required: true, unique: true })
  matricule: number;

  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;

  @Prop({ required: true })
  telephone: string;

  @Prop()
  courriel?: string;

  @Prop()
  adresse?: string;

  @Prop({ default: true })
  isActivated?: boolean;
}

export const PersonSchema = SchemaFactory.createForClass(PersonEntity);
