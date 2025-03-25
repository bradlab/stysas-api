import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ATimestamp } from 'framework/timestamp.abstract';
import { SalleSport } from 'domain/model/salle.model';
import { EquipementEntity } from './equipment.schema';
import { SubscriptionEntity } from './subscription.entity';

export type SalleSportDocument = HydratedDocument<SalleSportEntity>;

@Schema()
export class SalleSportEntity extends ATimestamp implements SalleSport {
    @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    id: string;

    @Prop({ required: true, unique: true })
    numero_salle: number;

    @Prop({ required: true })
    adresse_salle: string;

    @Prop({ required: true })
    capacite: number;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'EquipementEntity' }] })
    equipments: EquipementEntity[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AbonnementEntity' }] })
    subscriptions: SubscriptionEntity[];
}

export const SalleSportSchema = SchemaFactory.createForClass(SalleSportEntity);
