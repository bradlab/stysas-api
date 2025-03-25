import { PartialDeep } from 'domain/types';
import { IUpdatePwdDTO } from 'app/auth.input.dto';
import { IForgotPasswordDTO } from 'app/auth.input.dto';
import { ISigninAccoutDTO } from 'app/auth.input.dto';
import { IBasicPersonnalInfoDTO } from 'app/person.input.dto';
import { Staff } from 'domain/model/staff.model';

export interface ICreateStaffDTO extends IBasicPersonnalInfoDTO {
  avatar?: string;
}
export interface IRegisterStaffDTO extends ICreateStaffDTO {
  password: string;
  deviceToken?: string;
}
export interface ISignedStaffDTO {
  user: Staff;
  deviceToken?: string;
  accessToken: string;
}
export interface IUserQuery {
  ids?: string[];
  courriel?: string;
  telephone?: string;
}
export interface IResetPasswordDTO extends ISigninAccoutDTO {
  otpCode: string;
}

export abstract class IAuthService {
  abstract signup(data: IRegisterStaffDTO): Promise<ISignedStaffDTO>;
  abstract signin(data: ISigninAccoutDTO): Promise<ISignedStaffDTO>;

  abstract checkEmail(email: string): Promise<boolean>;

  abstract checkPhone(phone: string): Promise<boolean>;

  abstract updatePassword(user: Staff, data: IUpdatePwdDTO): Promise<boolean>;

  abstract forgotPassword(data: IForgotPasswordDTO): Promise<string>;

  abstract resetPassword(data: IResetPasswordDTO): Promise<boolean>;

  abstract search(data: PartialDeep<Staff>): Promise<Staff>;
}
