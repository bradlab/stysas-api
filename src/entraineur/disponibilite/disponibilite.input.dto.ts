import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ICreateDisponibiliteDTO, IDisponibiliteQuery } from './disponibilite.service.interface';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDisponibiliteDTO implements ICreateDisponibiliteDTO {
  @ApiProperty({ type: Date })
  @IsDateString()
  date_dispo: Date;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  horaireID: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  entraineurID: string;
}

export class UpdateDisponibiliteDTO extends PartialType(CreateDisponibiliteDTO) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class DisponibiliteQuerDTO extends PartialType(CreateDisponibiliteDTO) implements IDisponibiliteQuery {
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  ids: string[];
}
