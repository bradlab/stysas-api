import { Module } from '@nestjs/common';

import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { IStatisticService } from './statistic.service.interface';
import { StaffModule } from 'manager';

@Module({
  imports: [StaffModule],
  controllers: [StatisticController],
  providers: [
    { provide: IStatisticService, useClass: StatisticService },
  ],
})
export class StatisticModule {}
