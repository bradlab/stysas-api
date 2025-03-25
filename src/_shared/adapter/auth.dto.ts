import { ApiProperty } from '@nestjs/swagger';
import { IForgotPasswordDTO } from 'app/auth.input.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdatePwdDTO {
  @ApiProperty({
    type: String,
    name: 'oldPassword',
    description: 'The old password of the user',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({ type: String, name: 'newPassword' })
  @IsString()
  newPassword: string;
}
export class SigninAccoutDTO {
  @ApiProperty({
    type: String,
    name: 'email',
    description: 'The email address if the plateform use it for login',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  courriel?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  telephone?: string;

  @ApiProperty({ type: String, name: 'password' })
  @IsString()
  password: string;
}

export class ForgotPasswordDTO implements IForgotPasswordDTO {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  courriel?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  telephone?: string;
}

export class ResetPasswordDTO extends SigninAccoutDTO {
  @ApiProperty({
    type: String,
    name: 'otpCode',
    description: 'The otp validation code for reseting',
  })
  @IsOptional() // TODO: this is required
  @IsNotEmpty()
  otpCode: string;
}
