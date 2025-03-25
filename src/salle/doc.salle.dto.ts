import { ApiProperty } from '@nestjs/swagger';
import { CreateSalleDTO } from './salle.input.dto';
import { OSalle } from 'domain/model/salle.model';

export class DocSalleDTO
  extends CreateSalleDTO
  implements Partial<OSalle>
{
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
