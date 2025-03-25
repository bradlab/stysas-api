import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { PersonEntity } from './person.schema';
import { CarriereEntity } from './carriere.entity';
import { DisponibiliteEntity } from './disponibilite.entity';
import { Entraineur } from 'domain/model/coach.model';

export type EntraineurDocument = HydratedDocument<EntraineurEntity>;

@Schema()
export class EntraineurEntity extends PersonEntity implements Entraineur {
  @Prop({ required: true, unique: true })
  num_coach: number;

  @Prop({ required: true })
  specialite: string;

  @Prop({ required: true })
  date_emb: Date;

  @Prop({ required: true })
  sal_base: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CarriereEntity' }] })
  carrieres: CarriereEntity[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'DisponibiliteEntity' }] })
  disponibilites: DisponibiliteEntity[];
}

export const EntraineurSchema = SchemaFactory.createForClass(EntraineurEntity);
