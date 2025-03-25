import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { ICreateAdherentDTO } from './adherent.service.interface';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';
import { Adherent } from 'domain/model/adherent.model';

export class CreateAdherentDTO extends BasicPersonnalInfoDTO implements ICreateAdherentDTO {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  num_membre: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  poids: number;
}


export class UpdateAdherentDTO extends PartialType(CreateAdherentDTO) {
  @ApiProperty({
    type: String,
    name: 'id',
  })
  @IsString()
  @IsUUID()
  id: string;
}

export class AdherentQuerDTO extends PartialType(CreateAdherentDTO) implements Partial<Adherent> {
  @ApiProperty({
    type: String,
    name: 'ids',
    isArray: true,
    description: 'Liste des ID des adherents',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  ids: string[];
}
