import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ICreateEntraineurDTO, IEntraineurQuery } from './entraineur.service.interface';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';

export class CreateEntraineurDTO extends BasicPersonnalInfoDTO implements ICreateEntraineurDTO {

  @ApiProperty({ type: Date })
  @IsDateString()
  date_emb: Date;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  specialite: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  num_coach: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  sal_base: number;
}

export class UpdateEntraineurDTO extends PartialType(CreateEntraineurDTO) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class AEntraineurQuerDTO extends PartialType(CreateEntraineurDTO) implements IEntraineurQuery {
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  ids: string[];
}
