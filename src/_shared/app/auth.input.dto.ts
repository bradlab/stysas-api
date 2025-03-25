export interface ISigninAccoutDTO {
  courriel?: string;
  telephone?: string;
  deviceToken?: string;
  password: string;
}

export interface LogoutDTO {
  deviceToken?: string;
}
export interface IForgotPasswordDTO {
  courriel?: string;
  telephone?: string;
}
export interface IResetPasswordDTO extends ISigninAccoutDTO {
  otpCode: string;
}
export interface ISigninAccoutDTO {
  courriel?: string;
  telephone?: string;
  deviceToken?: string;
  password: string;
}
export interface IForgotPasswordDTO {
  courriel?: string;
  telephone?: string;
}
export interface LogoutDTO {
  deviceToken?: string;
}
export interface IUpdatePwdDTO {
  oldPassword: string;
  newPassword: string;
}
