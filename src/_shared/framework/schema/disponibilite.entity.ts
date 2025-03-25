import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ATimestamp } from 'framework/timestamp.abstract';
import { Disponibilite } from 'domain/model/disponibilite.model';
import { HoraireEntity } from './horaire.entity';
import { EntraineurEntity } from './entraineur.entity';

export type DisponibiliteDocument = HydratedDocument<DisponibiliteEntity>;

@Schema()
export class DisponibiliteEntity extends ATimestamp implements Disponibilite {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  id: string;

  @Prop({ required: true })
  date_dispo: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'HoraireEntity', required: true })
  horaire: HoraireEntity;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'EntraineurEntity', required: true })
  entraineur: EntraineurEntity;
}

export const DisponibiliteSchema = SchemaFactory.createForClass(DisponibiliteEntity);
