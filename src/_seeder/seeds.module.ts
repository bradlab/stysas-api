import { Module } from '@nestjs/common';
import { GlobalSeed } from './global.seed';
import { StaffModule } from 'src/manager';
import { AdherentModule } from 'adherent';
import { EquipmentModule } from 'equipment/equipment.module';
import { SalleModule } from 'salle/salle.module';
import { HoraireModule } from 'horaire/horaire.module';
import { EntraineurModule } from 'entraineur/entraineur.module';

@Module({
  imports: [
    StaffModule,
    AdherentModule,
    EquipmentModule,
    SalleModule,
    HoraireModule,
    EntraineurModule,
  ],
  providers: [GlobalSeed],
})
export class SeedsModule {}
