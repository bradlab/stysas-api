import { ApiProperty } from '@nestjs/swagger';
import { CreateEntraineurDTO } from './entraineur.input.dto';
import { OEntraineur } from 'domain/model/coach.model';
import { OCarriere } from 'domain/model/carriere.model';
import { ODisponibilite } from 'domain/model/disponibilite.model';

export class DocEntraineurDTO
  extends CreateEntraineurDTO
  implements OEntraineur
{
  @ApiProperty({ type: String })
  id: string;

  // @ApiProperty({ type: DocDisponibiliteDTO, isArray: true })
  disponibilites: ODisponibilite[];

  // @ApiProperty({ type: DocCarriereDTO, isArray: true  })
  carrieres: OCarriere[];

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
