import { Module } from '@nestjs/common';
import { DashboardRepository, IDashboardRepository } from './dashboard.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffEntity, StaffSchema } from 'framework/schema/staff.entity';
import { AdherentEntity, AdherentSchema } from 'framework/schema/adherent.entity';
import { CarriereEntity, CarriereSchema } from 'framework/schema/carriere.entity';
import { EntraineurEntity, EntraineurSchema } from 'framework/schema/entraineur.entity';
import { HoraireEntity, HoraireSchema } from 'framework/schema/horaire.entity';
import { EquipementEntity, EquipementSchema } from 'framework/schema/equipment.schema';
import { AbonnementSchema, SubscriptionEntity } from 'framework/schema/subscription.entity';
import { SalleSportEntity, SalleSportSchema } from 'framework/schema/salle.entity';
import { DisponibiliteEntity, DisponibiliteSchema } from 'framework/schema/disponibilite.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: StaffEntity.name, schema: StaffSchema, collection: 'users'},
      {name: AdherentEntity.name, schema: AdherentSchema, collection: 'adherents'},
      {name: CarriereEntity.name, schema: CarriereSchema, collection: 'carrieres'},
      {name: EntraineurEntity.name, schema: EntraineurSchema, collection: 'entraineurs'},
      {name: HoraireEntity.name, schema: HoraireSchema, collection: 'horaires'},
      {name: EquipementEntity.name, schema: EquipementSchema, collection: 'equipements'},
      {name: SubscriptionEntity.name, schema: AbonnementSchema, collection: 'abonnements'},
      {name: SalleSportEntity.name, schema: SalleSportSchema, collection: 'salles'},
      {name: DisponibiliteEntity.name, schema: DisponibiliteSchema, collection: 'disponibilites'},
    ]),
  ],
  providers: [
    StaffEntity,
    AdherentEntity,
    CarriereEntity,
    HoraireEntity,
    DisponibiliteEntity,
    SubscriptionEntity,
    SalleSportEntity,
    EntraineurEntity,
    EquipementEntity,
    {
      provide: IDashboardRepository,
      useClass: DashboardRepository,
    },
  ],
  exports: [IDashboardRepository],
})
export class DashboardRepositoryModule {}
