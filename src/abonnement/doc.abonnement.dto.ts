import { ApiProperty } from '@nestjs/swagger';
import { CreateAbonnementDTO } from './abonnement.input.dto';
import { OSalle } from 'domain/model/salle.model';
import { OAbonnement } from 'domain/model/subscription.model';
import { OAdherent } from 'domain/model/adherent.model';
import { DocAdherentDTO } from 'adherent/doc.adherent.dto';
import { DocSalleDTO } from 'salle/doc.salle.dto';

export class DocAbonnementDTO
  extends CreateAbonnementDTO
  implements Partial<OAbonnement>
{
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: DocAdherentDTO })
  adherent: OAdherent;

  @ApiProperty({ type: DocSalleDTO })
  salle: OSalle;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
