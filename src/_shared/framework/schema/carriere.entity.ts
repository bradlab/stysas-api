import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { SalleSportEntity } from './salle.entity';
import { ATimestamp } from 'framework/timestamp.abstract';
import { Carriere } from 'domain/model/carriere.model';
import { EntraineurEntity } from './entraineur.entity';

export type CarriereDocument = HydratedDocument<CarriereEntity>;

@Schema()
export class CarriereEntity extends ATimestamp implements Carriere {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  id: string;

  @Prop({ required: true })
  date_debut: Date;

  @Prop({ required: true })
  date_fin: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'SalleSportEntity', required: true })
  salle: SalleSportEntity;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'EntraineurEntity', required: true })
  entraineur: EntraineurEntity;
}

export const CarriereSchema = SchemaFactory.createForClass(CarriereEntity);
