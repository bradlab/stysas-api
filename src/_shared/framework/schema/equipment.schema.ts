import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ATimestamp } from 'framework/timestamp.abstract';
import { Equipement } from 'domain/model/equipment.model';
import { SalleSportEntity } from './salle.entity';

export type EquipementDocument = HydratedDocument<EquipementEntity>;

@Schema()
export class EquipementEntity extends ATimestamp implements Equipement {
    @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    id: string;

    @Prop({ required: true, unique: true })
    num_equip: number;

    @Prop({ required: true })
    nom_equip: string;

    @Prop({ required: true })
    fonction_equip: string;

    @Prop({ required: true })
    quantite: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'SalleSportEntity', required: true })
    salle: SalleSportEntity;
}

export const EquipementSchema = SchemaFactory.createForClass(EquipementEntity);
