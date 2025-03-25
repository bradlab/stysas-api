import { ApiProperty } from '@nestjs/swagger';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';
import { OAdherent } from 'domain/model/adherent.model';

export class DocAdherentDTO
  extends BasicPersonnalInfoDTO
  implements Partial<OAdherent>
{
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: Number, required: false })
  num_membre: number;
  
  @ApiProperty({ type: Number })
  poids: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
