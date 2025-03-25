import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ICreateHoraireDTO, IHoraireQuery } from './horaire.service.interface';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHoraireDTO implements ICreateHoraireDTO {
  @ApiProperty({ type: Number })
  @IsNumber()
  debut: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  fin: number;
}

export class UpdateHoraireDTO extends PartialType(CreateHoraireDTO) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class HoraireQueryDTO extends PartialType(CreateHoraireDTO) implements IHoraireQuery {
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
