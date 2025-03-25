import { ApiProperty } from '@nestjs/swagger';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';
import { BaseDashboardMetric } from './staff.service.interface';
import { OStaff } from 'domain/model/staff.model';

export class DocStaffDTO
  extends BasicPersonnalInfoDTO
  implements Partial<OStaff>
{
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  adresse: string;

  @ApiProperty({ type: Number })
  matricule: number;

  @ApiProperty({ type: Boolean })
  isActivated: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class DocSignedStaffDTO extends DocStaffDTO {
  @ApiProperty({ type: String })
  accessToken: string;
}
export class DocDashboardMetricDTO implements BaseDashboardMetric {
  @ApiProperty({ type: Number })
  clients: number;

  @ApiProperty({ type: Number })
  subscriptions: number;

  @ApiProperty({ type: Number })
  prestations: number;

  @ApiProperty({ type: Number })
  coachs: number;
}
