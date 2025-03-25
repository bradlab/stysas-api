import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IIDParamDTO,
  IIDsParamDTO,
} from 'app/param.input.dto';

import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Person } from '../domain/interface/person.model';

export class IDParamDTO implements IIDParamDTO {
  @IsString()
  id: string;
}

export class IDsBodyDTO implements IIDsParamDTO {
  @ApiProperty({
    type: String,
    isArray: true,
    name: 'ids',
    description: 'Liste des ID du modele concerné',
    required: false,
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  ids?: string[];
}

export class IDsParamDTO extends PartialType(IDsBodyDTO) {}

export class DateFilterDTO {
  @ApiProperty({
    type: Date,
    name: 'from',
    description: 'La date de début pour le filtrage',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiProperty({
    type: Date,
    name: 'to',
    description: 'La date de fin  pour le filtrage',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  to?: Date;

  @ApiProperty({
    type: Date,
    name: 'date',
    description:
      'La date de filtrage si le filtrage se fera pour une date spécifique',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: Date;
}


export class BasicPersonnalInfoDTO implements Partial<Person> {
  @ApiProperty({type: Number})
  @IsNumberString()
  @IsNotEmpty()
  matricule: number;

  @ApiProperty({
    type: String,
    description: 'Le nom de la personne',
  })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({
    type: String,
    description: 'Le ou les prénom(s) de la personne',
  })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({
    type: String,
    description:
      "Le numéro de téléphone sur lequel contacter l'utilisateur du compte ou envoyer des informations OTP",
  })
  @IsString()
  @IsPhoneNumber()
  telephone: string;

  @ApiProperty({
    type: String,
    description:
      "L'adresse e-mail sur laquelle partagent certaines informations avec l'utilisateur par notification",
    required: false,
  })
  @IsOptional()
  @IsEmail()
  courriel?: string;

  @ApiProperty({
    type: String,
    description: 'Adresse complète de la personne',
    required: false,
  })
  @IsOptional()
  @IsString()
  adresse?: string;
}
