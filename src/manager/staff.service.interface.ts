import { Staff } from 'domain/model/staff.model';
import { PartialDeep } from 'domain/types';
import { IUserQuery } from 'src/auth/auth.service.interface';
import { IRegisterStaffDTO } from 'src/auth/auth.service.interface';
import { ICreateStaffDTO } from 'src/auth/auth.service.interface';
export interface IUpdateClientDTO extends Partial<ICreateStaffDTO> {
  id: string;
}

export interface BaseDashboardMetric {
  clients: number;
  subscriptions: number;
  prestations: number;
  coachs: number;
}

export abstract class IStaffService {
  abstract getMetric(): Promise<BaseDashboardMetric>;

  abstract add(data: IRegisterStaffDTO): Promise<Staff>;

  abstract fetchAll(param?: IUserQuery): Promise<Staff[]>;

  abstract search(
    data: PartialDeep<Staff>,
    withAccess?: boolean,
  ): Promise<Staff>;

  abstract fetchOne(id: string): Promise<Staff>;

  abstract edit(data: IUpdateClientDTO): Promise<Staff>;

  abstract setState(ids: string[]): Promise<boolean>;

  abstract remove(id: string): Promise<boolean>;

  abstract clean(): Promise<boolean>;
}
