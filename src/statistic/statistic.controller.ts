import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { BaseDashboardMetric, IStatisticService } from './statistic.service.interface';
import { DocDashboardMetricDTO } from './doc.statistic.dto';
import { StaffGuard } from 'adapter/guard/auth.guard';

@ApiTags('Statistics')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('statistics')
export class StatisticController {
  constructor(private readonly statService: IStatisticService) {}

  @Get()
  @ApiOperation({
    summary: 'Métric du projet',
    description: 'Statistique concernant les adhérents et abonnements',
  })
  @ApiResponse({ type: DocDashboardMetricDTO })
  async metric(): Promise<BaseDashboardMetric> {
    
    return await this.statService.getMetric();
  }
}
