import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { StaffModule } from 'manager';
import { IEquipmentService } from './equipment.service.interface';

@Module({
  imports: [StaffModule],
  controllers: [EquipmentController],
  providers: [{provide: IEquipmentService, useClass: EquipmentService}],
  exports: [IEquipmentService],
})
export class EquipmentModule {}
