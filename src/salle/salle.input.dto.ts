import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ICreateSalleDTO, ISalleQuery } from './salle.service.interface';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSalleDTO implements ICreateSalleDTO {
  @ApiProperty({ type: Number })
  @IsNumber()
  numero_salle: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  adresse_salle: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  capacite: number;
}

export class UpdateSalleDTO extends PartialType(CreateSalleDTO) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class SalleQuerDTO extends PartialType(CreateSalleDTO) implements ISalleQuery {
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Liste des ID des salles',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  ids: string[];
}
