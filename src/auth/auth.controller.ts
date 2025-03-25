import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { StaffFactory } from '../_shared/adapter/factory/staff.factory';
import { IAuthService } from './auth.service.interface';
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  SigninAccoutDTO,
  UpdatePwdDTO,
} from 'adapter/auth.dto';
import { RegisterStaffDTO } from './auth.input.dto';
import { BaseConfig } from 'config/base.config';
import { GetUser, Public } from 'adapter/decorator';
import { DocSignedStaffDTO, DocStaffDTO } from 'src/manager/doc.staff.dto';
import { StaffGuard } from 'adapter/guard/auth.guard';
import { Staff, OStaff, SignedStaff } from 'domain/model/staff.model';

@ApiTags('User Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  @Public()
  @Get('check.email/:email')
  @ApiOperation({
    summary: 'Check email',
    description:
      'This endpoint allows to check if the email exist before register it',
  })
  @ApiParam({ type: String, name: 'email' })
  @ApiResponse({ type: Boolean })
  checkEmail(@Param('email') email: string): Promise<boolean> {
    return this.authService.checkEmail(email);
  }

  @Public()
  @Get('check.phone/:phone')
  @ApiOperation({
    summary: 'Check phone',
    description:
      'This endpoint allows to check if the phone exist before register it',
  })
  @ApiParam({ type: String, name: 'phone' })
  @ApiResponse({ type: Boolean })
  checkPhone(@Param('phone') phone: string): Promise<boolean> {
    return this.authService.checkPhone(phone);
  }

  @ApiBearerAuth()
  @UseGuards(StaffGuard)
  @Get('token.signin')
  @ApiOperation({ summary: 'Token connexion' })
  @ApiResponse({ type: DocSignedStaffDTO })
  async signinByToken(@GetUser() user: Staff): Promise<OStaff> {
    return StaffFactory.getUser(user);
  }

  /**
   * @method POST
   */

  @Public()
  @Post('signup')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Create manager account',
    description: 'Créé un compte utilisateur',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: BaseConfig.setFilePath,
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.imageFileFilter,
    }),
  )
  @ApiResponse({ type: DocStaffDTO })
  async create(
    @Body() data: RegisterStaffDTO,
    @UploadedFile() file: any,
  ): Promise<SignedStaff> {
    data.avatar = file?.filename;
    const { accessToken, user } = await this.authService.signup(data);
    if (user) {
      return {
        accessToken,
        ...StaffFactory.getUser(user),
      };
    }
    throw new InternalServerErrorException('User not created');
  }

  @Post('signin')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'User connexion endpoint' })
  @ApiBody({ type: SigninAccoutDTO })
  @ApiResponse({ type: DocSignedStaffDTO })
  async signin(@Body() data: SigninAccoutDTO): Promise<SignedStaff> {
    const { accessToken, user } = await this.authService.signin(data);
    if (user) {
      return {
        accessToken,
        ...StaffFactory.getUser(user),
      };
    }
    throw new UnauthorizedException('User not found');
  }

  @Post('password.forgot')
  @ApiOperation({
    summary: 'Forgot password',
    description:
      "Ce endpoint permet à un utilisateur de notifier à un admin qu'il a oublié son mot de passe",
  })
  @ApiBody({ type: ForgotPasswordDTO })
  @ApiResponse({ type: String })
  async forgotPassword(@Body() data: ForgotPasswordDTO): Promise<string> {
    return await this.authService.forgotPassword(data);
  }

  @Post('password.reset')
  @ApiOperation({
    summary: 'Reset password',
    description: "Réinitialiser le mot de passe de l'utilisateur",
  })
  @ApiBody({ type: ResetPasswordDTO })
  @ApiResponse({ type: Boolean })
  async resetPassword(@Body() data: ResetPasswordDTO): Promise<boolean> {
    return await this.authService.resetPassword({
      ...data,
      otpCode: data.otpCode?.toString(),
    });
  }

  @Patch('password.update')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update account's password",
    description: "Modifier le mot de passe de l'utilisateur",
  })
  @ApiBody({ type: UpdatePwdDTO })
  @ApiResponse({ type: Boolean })
  async updatePassword(
    @GetUser() user: Staff,
    @Body() data: UpdatePwdDTO,
  ): Promise<boolean> {
    return await this.authService.updatePassword(user, data);
  }
}
