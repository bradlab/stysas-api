import { ApiProperty } from '@nestjs/swagger';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';
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
