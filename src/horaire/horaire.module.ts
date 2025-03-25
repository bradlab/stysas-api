import { Module } from '@nestjs/common';
import { HoraireService } from './horaire.service';
import { HoraireController } from './horaire.controller';
import { IHoraireService } from './horaire.service.interface';
import { StaffModule } from 'manager';

@Module({
  imports: [StaffModule],
  controllers: [HoraireController],
  providers: [{provide: IHoraireService, useClass: HoraireService}],
  exports: [IHoraireService],
})
export class HoraireModule {}
