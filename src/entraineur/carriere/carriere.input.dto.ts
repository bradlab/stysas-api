import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ICreateCarriereDTO, ICarriereQuery } from './carriere.service.interface';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCarriereDTO implements ICreateCarriereDTO {
  @ApiProperty({ type: Date })
  @IsDateString()
  date_debut: Date;

  @ApiProperty({ type: Date })
  @IsDateString()
  date_fin: Date;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  salleID: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  entraineurID: string;
}

export class UpdateCarriereDTO extends PartialType(CreateCarriereDTO) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CarriereQueryDTO extends PartialType(CreateCarriereDTO) implements ICarriereQuery {
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  ids: string[];
}
