import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ICreateEquipmentDTO, IEquipmentQuery } from './equipment.service.interface';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEquipmentDTO implements ICreateEquipmentDTO {
  @ApiProperty({ type: Number })
  @IsNumber()
  num_equip: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  nom_equip: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  fonction_equip: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  quantite: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  salleID: string;
}

export class UpdateEquipmentDTO extends PartialType(CreateEquipmentDTO) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class EquipmentQuerDTO extends PartialType(CreateEquipmentDTO) implements IEquipmentQuery {
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Liste des ID des équipements',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  ids: string[];
}
