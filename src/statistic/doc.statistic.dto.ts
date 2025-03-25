import { ApiProperty } from '@nestjs/swagger';
import { BaseDashboardMetric } from './statistic.service.interface';

export class DocDashboardMetricDTO implements BaseDashboardMetric {
  @ApiProperty({ type: Number })
  adherents: number;

  @ApiProperty({ type: Number })
  abonnements: number;

  @ApiProperty({ type: Number })
  salles: number;

  @ApiProperty({ type: Number })
  coachs: number;

  @ApiProperty({ type: Number })
  equipements: number;

  @ApiProperty({ type: Number })
  carrieres: number;
}
