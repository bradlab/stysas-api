import { Module } from '@nestjs/common';

import { AdherentController } from './adherent.controller';
import { AuthModule } from '../auth';
import { IAdherentService } from './adherent.service.interface';
import { AdherentService } from './adherent.service';

@Module({
  imports: [AuthModule],
  controllers: [AdherentController],
  providers: [
    { provide: IAdherentService, useClass: AdherentService },
  ],
  exports: [IAdherentService, AuthModule],
})
export class AdherentModule {}
