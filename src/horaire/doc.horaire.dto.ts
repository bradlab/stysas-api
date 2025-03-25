import { ApiProperty } from '@nestjs/swagger';
import { CreateHoraireDTO } from './horaire.input.dto';
import { OHoraire } from 'domain/model/horaire.model';

export class DocHoraireDTO
  extends CreateHoraireDTO
  implements OHoraire
{
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
