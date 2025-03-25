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
import { IAdherentQuery, IAdherentService, ICreateAdherentDTO, IUpdateAdherentDTO } from './adherent.service.interface';
import { IDashboardRepository } from 'adapter/database/dashboard.repository';
import { AdherentFactory } from 'adapter/factory/adherent.factory';
import { Staff } from 'domain/model/staff.model';
import { Adherent } from 'domain/model/adherent.model';

@Injectable()
export class AdherentService implements IAdherentService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
  ) {}

  async fetchAll(param?: IAdherentQuery): Promise<Adherent[]> {
    if (!DataHelper.isEmpty(param) && param) {
      let queryParam: DeepQueryType<Adherent> | DeepQueryType<Adherent>[] = {};
      const { ids } = param!;
      if (DataHelper.isNotEmptyArray(ids!)) {
        if (typeof ids === 'string') {
          param!.ids = [ids];
        }
        queryParam = { ...queryParam, id: VIn(param!.ids!) };
      }
      if (!DataHelper.isEmpty(queryParam)) {
        return await this.dashboardRepository.adherents.find({
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
        });
      }

      return [];
    }
    return await this.dashboardRepository.adherents.find({
      order: { createdAt: 'DESC' },
    });
  }

  async search(data: IAdherentQuery): Promise<Adherent> {
    try {
      return this.dashboardRepository.adherents.findOne({where: data});
    } catch (error) {
      this.logger.error(error, 'ERROR::AdherentService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Adherent> {
    try {
      const adherent = await this.dashboardRepository.adherents.findOne({
        relations: { subscriptions: true },
        where: { id },
      });
      if (adherent) {
        adherent.subscriptions = await this.dashboardRepository.subscriptions.find({
          relations: { salle: true },
          where: { adherent },
        });
        if (DataHelper.isNotEmptyArray(adherent.subscriptions)) {
          adherent.subscriptions = await Promise.all(adherent.subscriptions.map(async (sub) => {
            if (sub.salle) return sub;
            sub.salle = await this.dashboardRepository.salles.findOneBy({ id: sub.salle });
            return sub;
          }));
        }
      }
      return adherent;
    } catch (error) {
      this.logger.error(error, 'ERROR::AdherentService.fetchOne');
      return null as any;
    }
  }

  async add(data: ICreateAdherentDTO): Promise<Adherent> {
    try {
      const { courriel, telephone, matricule } = data;
      const existed = await this.dashboardRepository.adherents.findOne({
        where: [
          { telephone },
          { matricule },
          { courriel },
        ],
      });
      // if (courriel) existed = await this.search({ courriel });
      // if (telephone) existed = await this.search({ telephone });
      if (existed!) {
        throw new ConflictException(
          'Un adherent avec le même numéro de telephone existe déjà',
        );
      }
      const adherent = await this.dashboardRepository.adherents.create(
        AdherentFactory.create(data),
      );
      return adherent;
    } catch (error) {
      this.logger.error(error, 'ERROR::AdherentService.add');
      throw error;
    }
  }

  async edit(data: IUpdateAdherentDTO): Promise<Adherent> {
    try {
      const { id } = data;
      const adherent = await this.fetchOne(id);
      if (adherent) {
        const newInstance = AdherentFactory.update(adherent, data);
        return await this.dashboardRepository.adherents.update(newInstance);
      }
      throw new NotFoundException('Adherent not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AdherentService.editUser');
      throw error;
    }
  }

  async bulk(staff: Staff, datas: ICreateAdherentDTO[]): Promise<Adherent[]> {
    try {
      const adherents: Adherent[] = [];
      if (DataHelper.isNotEmptyArray(datas)) {
        if (!staff) {
          throw new NotFoundException('Adherent not found');
        }
        for (const data of datas) {
          const { telephone, matricule, courriel } = data;
          // let queryParam: DeepQueryType<Adherent> | DeepQueryType<Adherent>[] = {};
          // if (telephone) queryParam = { ...queryParam, telephone };
          // if (telephone) queryParam = { ...queryParam, telephone };
          const existingAdherent = await this.dashboardRepository.adherents.findOne({
            where: [
              { telephone },
              { matricule },
              { courriel },
            ],
          });
          
          if(!existingAdherent) {
            adherents.push(AdherentFactory.create(data));
          }
        }
      }
      if (DataHelper.isNotEmptyArray(adherents)) {
        return await this.dashboardRepository.adherents.createMany(adherents );
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::AdherentService.add');
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const adherent = await this.fetchOne(id);
      if (adherent) {
        return await this.dashboardRepository.adherents
          .remove(adherent)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AdherentService.remove');
      throw error;
    }
  }
  
  // Nettoyer la table
  async clean(): Promise<boolean> {
    try {
      throw new NotImplementedException();
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AdherentService.clean');
      throw error;
    }
  }
}
