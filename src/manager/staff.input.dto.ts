import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { IUserQuery } from 'src/auth/auth.service.interface';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';

export class StaffAccoutDTO extends BasicPersonnalInfoDTO {
  avatar?: string;
}

export class RegisterStaffDTO extends StaffAccoutDTO {
  @ApiProperty({
    type: String,
    name: 'password',
  })
  @IsString()
  password: string;
}

export class UpdateClientDTO extends PartialType(StaffAccoutDTO) {
  @ApiProperty({
    type: String,
    name: 'id',
    description: 'ID of the given user',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UserQuerDTO implements IUserQuery {
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Liste des ID des ustilisateurs',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  ids: string[];

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  courriel?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  telephone?: string;
}
