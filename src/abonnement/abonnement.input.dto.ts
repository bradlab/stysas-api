import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ICreateAbonnementDTO, IAbonnementQuery } from './abonnement.service.interface';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAbonnementDTO implements ICreateAbonnementDTO {
  @ApiProperty({ type: Date })
  @IsDateString()
  date_debut: Date;

  @ApiProperty({ type: Date })
  @IsDateString()
  date_fin: Date;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  adherentID: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  salleID: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  actif: boolean;
}

export class UpdateAbonnementDTO extends PartialType(CreateAbonnementDTO) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class AbonnementQuerDTO extends PartialType(CreateAbonnementDTO) implements IAbonnementQuery {
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Liste des ID des abonnements',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  ids: string[];
}
