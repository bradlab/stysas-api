import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashFactory } from 'adapter/hash.factory';

import { DataGenerator } from 'domain/generator/data.generator';
import { PartialDeep } from 'domain/types';
import {
  IAuthService,
  IRegisterStaffDTO,
} from './auth.service.interface';
import { IResetPasswordDTO } from './auth.service.interface';
import { ISignedStaffDTO } from './auth.service.interface';
import { IUpdatePwdDTO } from 'app/auth.input.dto';
import { IForgotPasswordDTO } from 'app/auth.input.dto';
import { ISigninAccoutDTO } from 'app/auth.input.dto';
import { StaffFactory } from '../_shared/adapter/factory/staff.factory';
import { IDashboardRepository } from 'adapter/database/dashboard.repository';
import { Staff } from 'domain/model/staff.model';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
    private jwtService: JwtService,
  ) {}

  async signup(data: IRegisterStaffDTO): Promise<ISignedStaffDTO> {
    try {
      const { courriel, telephone } = data;
      let existed: Staff = undefined as any;
      if (courriel) existed = await this.search({ courriel });
      if (telephone) existed = await this.search({ telephone });
      if (existed) {
        throw new ConflictException(
          'Employee account email or phone number allready exist',
        );
      }
      const user = await this.dashboardRepository.users.create(
        await StaffFactory.create(data),
      );
      if (user)
        return this.signin({ courriel, password: data.password });
      throw new InternalServerErrorException();
    } catch (error) {
      this.logger.error(error, 'ERROR::AuthService.add');
      throw error;
    }
  }

  async signin(data: ISigninAccoutDTO): Promise<ISignedStaffDTO> {
    try {
      const { courriel, telephone } = data;
      const user = await this._validateUser(data);
      if (user) {
        return {
          accessToken: this.jwtService.sign({ courriel, telephone, id: user.id }),
          user,
        };
      }
      throw new UnauthorizedException();
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.signin');
      throw error;
    }
  }

  async checkEmail(courriel: string): Promise<boolean> {
    try {
      const user = await this.search({ courriel });
      return user ? true : false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.checkEmail');
      throw error;
    }
  }

  async checkPhone(telephone: string): Promise<boolean> {
    try {
      const user = await this.search({ telephone });
      return user ? true : false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.checkPhone');
      throw error;
    }
  }

  async updatePassword(staff: Staff, data: IUpdatePwdDTO): Promise<boolean> {
    try {
      const { oldPassword, newPassword } = data;
      const user = await this.search({ id: staff.id });
      if (user) {
        if (await HashFactory.isRightPwd(oldPassword, user.password!)) {
          user.password = await HashFactory.hashPwd(newPassword);
          return await this.dashboardRepository.users
            .update(user)
            .then(() => true);
        }
        throw new UnauthorizedException();
      }
      throw new NotFoundException('User not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.updatePassword');

      throw error;
    }
  }

  async forgotPassword(data: IForgotPasswordDTO): Promise<string> {
    try {
      const user = await this.search(data);
      if (user) {
        user.code = DataGenerator.randomNumber();
        return await this.dashboardRepository.users
          .update(user)
          .then(() => user.code) as any;
      }
      throw new NotFoundException('User not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.forgotPassword');
      throw error;
    }
  }

  async resetPassword(data: IResetPasswordDTO): Promise<boolean> {
    try {
      const { telephone, password, otpCode } = data;
      const user = await this.search({ telephone });
      if (user /* && otpCode && user?.code === otpCode */) { // TODO: remettre
        user.code = null as any;
        user.password = await HashFactory.hashPwd(password);
        return await this.dashboardRepository.users
          .update(user)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.resetPassword');
      throw error;
    }
  }

  private async _validateUser(data: ISigninAccoutDTO): Promise<Staff> {
    const { telephone, courriel, password } = data;
    const user = await this.search({ telephone, courriel, isActivated: true });
    if (user && (await HashFactory.isRightPwd(password, user.password))) {
      return user;
    }
    return null as any;
  }

  async search(data: PartialDeep<Staff>): Promise<Staff> {
    try {
      const { courriel, telephone, isActivated, id , matricule} = data;
      let options = {};
      if (id) options['id'] = id;
      if (isActivated) options['isActivated'] = isActivated;
      if (telephone) {
        options['telephone'] = telephone;
      } else if (matricule) {
        options['matricule'] = matricule;
      } else if (courriel) {
        options['courriel'] = courriel;
      } else {
        options = { ...data };
      }

      const user = await this.dashboardRepository.users.findOne({
        where: { ...options },
      });
      return user;
    } catch (error) {
      this.logger.error(error, 'ERROR::AuthService.search');
      throw error;
    }
  }
}
