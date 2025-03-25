import { Module } from '@nestjs/common';
import { CarriereService } from './carriere.service';
import { CarriereController } from './carriere.controller';
import { StaffModule } from 'manager';
import { ICarriereService } from './carriere.service.interface';

@Module({
  imports: [StaffModule],
  controllers: [CarriereController],
  providers: [{provide: ICarriereService, useClass: CarriereService}],
})
export class CarriereModule {}
