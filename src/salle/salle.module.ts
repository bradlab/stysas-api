import { Module } from '@nestjs/common';
import { SalleService } from './salle.service';
import { SalleController } from './salle.controller';
import { ISalleService } from './salle.service.interface';
import { StaffModule } from 'manager';

@Module({
  imports: [StaffModule],
  controllers: [SalleController],
  providers: [{provide: ISalleService, useClass: SalleService}],
  exports: [ISalleService],
})
export class SalleModule {}
