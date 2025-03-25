import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ATimestamp } from 'framework/timestamp.abstract';
import { Horaire } from 'domain/model/horaire.model';
import { DisponibiliteEntity } from './disponibilite.entity';

export type HoraireDocument = HydratedDocument<HoraireEntity>;

@Schema()
export class HoraireEntity extends ATimestamp implements Horaire {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  id: string;

  @Prop({ required: true })
  debut: number;

  @Prop({ required: true })
  fin: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'DisponibiliteEntity' }] })
  disponibilites: DisponibiliteEntity[];
}

export const HoraireSchema = SchemaFactory.createForClass(HoraireEntity);
