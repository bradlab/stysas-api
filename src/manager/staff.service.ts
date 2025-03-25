import {
  Logger,
  Injectable,
  ConflictException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';

import { DataHelper } from 'adapter/helper/data.helper';
import { DeepQueryType, PartialDeep } from 'domain/types';
import { VIn } from 'framework/orm.clauses';
import { BaseDashboardMetric, IStaffService, IUpdateClientDTO } from './staff.service.interface';
import { IUserQuery } from 'src/auth/auth.service.interface';
import { IRegisterStaffDTO } from 'src/auth/auth.service.interface';
import { StaffFactory } from '../_shared/adapter/factory/staff.factory';
import { IAuthService } from '../auth/auth.service.interface';
import { IDashboardRepository } from 'adapter/database/dashboard.repository';
import { Staff } from 'domain/model/staff.model';

@Injectable()
export class StaffService implements IStaffService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
    private authService: IAuthService,
  ) {}


  async fetchAll(param?: IUserQuery): Promise<Staff[]> {
    if (!DataHelper.isEmpty(param) && param) {
      let queryParam: DeepQueryType<Staff> | DeepQueryType<Staff>[] = {};
      const { ids } = param!;
      if (DataHelper.isNotEmptyArray(ids!)) {
        if (typeof ids === 'string') {
          param!.ids = [ids];
        }
        queryParam = { ...queryParam, id: VIn(param.ids!) };
      }
      if (!DataHelper.isEmpty(queryParam)) {
        return await this.dashboardRepository.users.find({
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
        });
      }

      return [];
    }
    return await this.dashboardRepository.users.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getMetric(): Promise<BaseDashboardMetric> {
    try {
      const subscriptions = await this.dashboardRepository.subscriptions.find({
        where: {actif: true}
      });
      const clients = await this.dashboardRepository.adherents.find();
      const coachs = await this.dashboardRepository.coachs.find();
      const prestations = await this.dashboardRepository.salles.find();
      return {
        clients: clients.length,
        subscriptions: subscriptions.length,
        prestations: prestations.length,
        coachs: coachs.length
      }
    } catch (error) {
      this.logger.error(error, 'ERROR::StaffService.fetchAll');
      throw error;
    }
  }

  async search(data: PartialDeep<Staff>): Promise<Staff> {
    try {
      return this.authService.search(data);
    } catch (error) {
      this.logger.error(error, 'ERROR::StaffService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Staff> {
    return await this.dashboardRepository.users.findOne({
      where: { id },
    });
  }

  async add(data: IRegisterStaffDTO): Promise<Staff> {
    try {
      const { courriel, telephone } = data;
      let existed: Staff;
      if (courriel) existed = await this.authService.search({ courriel });
      if (telephone) existed = await this.authService.search({ telephone });
      if (existed!) {
        throw new ConflictException(
          'Employee account courriel or phone number allready exist',
        );
      }
      const client = await this.dashboardRepository.users.create(
        await StaffFactory.create(data),
      );
      return client;
    } catch (error) {
      this.logger.error(error, 'ERROR::StaffService.add');
      throw error;
    }
  }

  async edit(data: IUpdateClientDTO): Promise<Staff> {
    try {
      const { id } = data;
      const user = await this.fetchOne(id);
      if (user) {
        const userInstance = StaffFactory.update(user, data);
        return await this.dashboardRepository.users.update(userInstance);
      }
      throw new NotFoundException('Client not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::StaffService.editUser');

      throw error;
    }
  }

  async setState(ids: string[]): Promise<boolean> {
    try {
      const users = ids && (await this.dashboardRepository.users.findByIds(ids));
      if (users?.length > 0) {
        users.map((user) => {
          user.isActivated = !user.isActivated;
          return user;
        });
        return await this.dashboardRepository.users
          .updateMany(users)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error, 'ERROR::StaffService.setState');
      return false;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const user = await this.fetchOne(id);
      if (user) {
        return await this.dashboardRepository.users
          .remove(user)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::StaffService.remove');
      throw error;
    }
  }
  async clean(): Promise<boolean> {
    try {
      throw new NotImplementedException();
    } catch (error) {
      this.logger.error(error.message, 'ERROR::StaffService.remove');
      throw error;
    }
  }
}
