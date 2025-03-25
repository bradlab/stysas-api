import { ApiProperty } from '@nestjs/swagger';
import { CreateEquipmentDTO } from './equipment.input.dto';
import { OEquipement } from 'domain/model/equipment.model';

export class DocEquipmentDTO
  extends CreateEquipmentDTO
  implements Partial<OEquipement>
{
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
