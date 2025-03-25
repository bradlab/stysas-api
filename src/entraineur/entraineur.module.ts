import { Module } from '@nestjs/common';
import { EntraineurService } from './entraineur.service';
import { EntraineurController } from './entraineur.controller';
import { DisponibiliteModule } from './disponibilite/disponibilite.module';
import { CarriereModule } from './carriere/carriere.module';
import { IEntraineurService } from './entraineur.service.interface';
import { StaffModule } from 'manager';

@Module({
  imports: [StaffModule, DisponibiliteModule, CarriereModule, ],
  controllers: [EntraineurController],
  providers: [{provide: IEntraineurService, useClass: EntraineurService}],
  exports: [IEntraineurService],
})
export class EntraineurModule {}
