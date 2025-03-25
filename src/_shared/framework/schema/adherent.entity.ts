import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { PersonEntity } from './person.schema';
import { SubscriptionEntity } from './subscription.entity';
import { Adherent } from 'domain/model/adherent.model';

export type AdherentDocument = HydratedDocument<AdherentEntity>;

@Schema()
export class AdherentEntity extends PersonEntity implements Adherent {
  @Prop({ required: true, unique: true })
  num_membre: number;

  @Prop({ required: true })
  poids: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'SubscriptionEntity' }] })
  subscriptions?: SubscriptionEntity[];
}

export const AdherentSchema = SchemaFactory.createForClass(AdherentEntity);
