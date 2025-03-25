import {
  SetMetadata,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { DataHelper } from 'adapter/helper/data.helper';
import { Staff } from 'domain/model/staff.model';

export const Public = () => SetMetadata('isPublic', true);

export const GetUser = createParamDecorator((_, context): Staff => {
  const req = context.getArgs()[0];
  if (!DataHelper.isEmpty(req?.user)) return req.user;

  throw new UnauthorizedException();
});
