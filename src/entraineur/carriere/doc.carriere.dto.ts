import { ApiProperty } from '@nestjs/swagger';
import { CreateCarriereDTO } from './carriere.input.dto';
import { OEntraineur } from 'domain/model/coach.model';
import { DocEntraineurDTO } from 'entraineur/doc.entraineur.dto';
import { OCarriere } from 'domain/model/carriere.model';
import { DocSalleDTO } from 'salle/doc.salle.dto';

export class DocCarriereDTO
  extends CreateCarriereDTO
  implements OCarriere
{
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: DocEntraineurDTO})
  entraineur: OEntraineur;

  @ApiProperty({ type: DocSalleDTO})
  salle: OEntraineur;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
