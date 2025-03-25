import { Module } from '@nestjs/common';
import { DisponibiliteService } from './disponibilite.service';
import { DisponibiliteController } from './disponibilite.controller';
import { StaffModule } from 'manager';
import { IDisponibiliteService } from './disponibilite.service.interface';

@Module({
  imports: [StaffModule],
  controllers: [DisponibiliteController],
  providers: [{provide: IDisponibiliteService, useClass: DisponibiliteService}],
})
export class DisponibiliteModule {}
