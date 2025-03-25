import { Module } from '@nestjs/common';
import { AbonnementService } from './abonnement.service';
import { AbonnementController } from './abonnement.controller';
import { StaffModule } from 'manager';
import { IAbonnemntService } from './abonnement.service.interface';

@Module({
  imports: [StaffModule],
  controllers: [AbonnementController],
  providers: [{provide: IAbonnemntService, useClass: AbonnementService}],
})
export class AbonnementModule {}
