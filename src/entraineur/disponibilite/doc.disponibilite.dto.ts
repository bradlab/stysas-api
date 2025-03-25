import { ApiProperty } from '@nestjs/swagger';
import { CreateDisponibiliteDTO } from './disponibilite.input.dto';
import { OEntraineur } from 'domain/model/coach.model';
import { ODisponibilite } from 'domain/model/disponibilite.model';
import { DocEntraineurDTO } from 'entraineur/doc.entraineur.dto';
import { OHoraire } from 'domain/model/horaire.model';
import { DocHoraireDTO } from 'horaire/doc.horaire.dto';

export class DocDisponibiliteDTO
  extends CreateDisponibiliteDTO
  implements ODisponibilite
{
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: DocEntraineurDTO})
  entraineur: OEntraineur;

  @ApiProperty({ type: DocHoraireDTO})
  horaire: OHoraire;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
