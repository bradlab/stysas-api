import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ATimestamp } from 'framework/timestamp.abstract';
import { AdherentEntity } from './adherent.entity';
import { SalleSportEntity } from './salle.entity';

export type AbonnementDocument = HydratedDocument<SubscriptionEntity>;

@Schema()
export class SubscriptionEntity extends ATimestamp {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  id: string;

  @Prop({ required: true })
  date_debut: Date;

  @Prop({ required: true })
  date_fin: Date;

  @Prop({ required: true, default: true })
  actif: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AdherentEntity', required: true })
  adherent: AdherentEntity;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'SalleSportEntity', required: true })
  salle: SalleSportEntity;
}

export const AbonnementSchema = SchemaFactory.createForClass(SubscriptionEntity);
