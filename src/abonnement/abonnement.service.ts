import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICreateAbonnementDTO, IAbonnemntService, IAbonnementQuery, IUpdateAbonnementDTO } from './abonnement.service.interface';
import { IDashboardRepository } from 'adapter/database/dashboard.repository';
import { VIn } from 'framework/orm.clauses';
import { AbonnementFactory } from 'adapter/factory/abonnement.factory';
import { DataHelper } from 'adapter/helper/data.helper';
import { DeepQueryType } from 'domain/types';
import { Abonnement } from 'domain/model/subscription.model';

@Injectable()
export class AbonnementService implements IAbonnemntService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
  ) {}
  
  async fetchAll(param?: IAbonnementQuery): Promise<Abonnement[]> {
    try {
      let abonnements: Abonnement [] = [];
      if (!DataHelper.isEmpty(param) && param) {
        let queryParam: DeepQueryType<Abonnement> | DeepQueryType<Abonnement>[] = {};
        const { ids } = param!;
        if (DataHelper.isNotEmptyArray(ids!)) {
          if (typeof ids === 'string') {
            param!.ids = [ids];
          }
          queryParam = { ...queryParam, id: VIn(param!.ids!) };
        }
        if (!DataHelper.isEmpty(queryParam)) {
          abonnements = await this.dashboardRepository.subscriptions.find({
            // relations: { adherent: true, salle: true },
            where: { ...queryParam },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        abonnements = await this.dashboardRepository.subscriptions.find({
          // relations: { adherent: true, salle: true },
          order: { createdAt: 'DESC' },
        });
      }
      if (abonnements) {
        return Promise.all(abonnements.map(async (sub) => {
          sub.adherent = await this.dashboardRepository.adherents.findOneBy({ id: sub.adherent });
          sub.salle = await this.dashboardRepository.salles.findOneBy({ id: sub.salle });
          return sub;
        }));
      }
      return abonnements;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AbonnementService.fetchAll');
      return [];
    }
  }

  async search(data: IAbonnementQuery): Promise<Abonnement> {
    try {
      let options = {};
      if (data.ids) options = { id: VIn(data.ids) }
      if (data.salleID) options = {...options, salleId: data.salleID}
      if (data.adherentID) options = {...options, adherentId: data.adherentID}
      return this.dashboardRepository.subscriptions.findOneBy(options);
    } catch (error) {
      this.logger.error(error, 'ERROR::AbonnementService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Abonnement> {
    try {
      const abonnement = await this.dashboardRepository.subscriptions.findOne({
        // relations: { adherent: true, salle: true, },
        where: { id },
      });
      if (abonnement) {
        abonnement.adherent = await this.dashboardRepository.adherents.findOneBy({ id: abonnement.adherent });
        abonnement.salle = await this.dashboardRepository.salles.findOneBy({ id: abonnement.salle });
      }
      return abonnement;
    } catch (error) {
      this.logger.error(error, 'ERROR::AbonnementService.fetchOne');
      return null as any;
    }
  }

  async add(data: ICreateAbonnementDTO): Promise<Abonnement> {
    try {
      const { adherentID, salleID } = data;
      // let existed: Abonnement;
      // existed = await this.search({ salleID, adherentID });
      // if (existed!) {
      //   throw new ConflictException(
      //     'Ce numéro de abonnement existe déjà',
      //   );
      // }
      const adherent = await this.dashboardRepository.adherents.findOneByID(adherentID);
      if (!adherent) throw new NotFoundException('Adherent not found');
      const salle = await this.dashboardRepository.salles.findOneByID(salleID);
      if (!salle) throw new NotFoundException('Salle not found');
      const abonnement = await this.dashboardRepository.subscriptions.create(
        AbonnementFactory.create(data),
      );
      if (abonnement) {
        abonnement.adherent = adherent;
        abonnement.salle = salle;
      }
      return abonnement;
    } catch (error) {
      this.logger.error(error, 'ERROR::AbonnementService.add');
      throw error;
    }
  }

  async edit(data: IUpdateAbonnementDTO): Promise<Abonnement> {
    try {
      const { id } = data;
      const user = await this.fetchOne(id);
      if (user) {
        const newInstance = AbonnementFactory.update(user, data);
        return await this.dashboardRepository.subscriptions.update(newInstance);
      }
      throw new NotFoundException('Abonnement not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AbonnementService.editUser');
      throw error;
    }
  }

  async setState(ids: string[]): Promise<boolean> {
    try {
      const abonnements = ids && (await this.dashboardRepository.subscriptions.findByIds(ids));
      if (abonnements?.length > 0) {
        abonnements.map((abonnemnt) => abonnemnt.actif = !abonnemnt.actif);
        return await this.dashboardRepository.subscriptions
          .updateMany(abonnements)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error, 'ERROR::AbonnementService.setState');
      return false;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const abonnement = await this.fetchOne(id);
      if (abonnement) {
        return await this.dashboardRepository.subscriptions
          .remove(abonnement)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AbonnementService.remove');
      throw error;
    }
  }
}
