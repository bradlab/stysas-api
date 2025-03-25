import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICreateSalleDTO, ISalleService, ISalleQuery, IUpdateSalleDTO } from './salle.service.interface';
import { IDashboardRepository } from 'adapter/database/dashboard.repository';
import { VIn } from 'framework/orm.clauses';
import { SalleFactory } from 'adapter/factory/salle.factory';
import { DataHelper } from 'adapter/helper/data.helper';
import { Staff } from 'domain/model/staff.model';
import { DeepQueryType } from 'domain/types';
import { SalleSport as Salle } from 'domain/model/salle.model';

@Injectable()
export class SalleService implements ISalleService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
  ) {}
  
  async fetchAll(param?: ISalleQuery): Promise<Salle[]> {
    if (!DataHelper.isEmpty(param) && param) {
      let queryParam: DeepQueryType<Salle> | DeepQueryType<Salle>[] = {};
      const { ids } = param!;
      if (DataHelper.isNotEmptyArray(ids!)) {
        if (typeof ids === 'string') {
          param!.ids = [ids];
        }
        queryParam = { ...queryParam, id: VIn(param!.ids!) };
      }
      if (!DataHelper.isEmpty(queryParam)) {
        return await this.dashboardRepository.salles.find({
          relations: { equipments: true, subscriptions: { adherent: true }, },
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
          select: {capacite: true, numero_salle: true},
          skip: 2,
          take: 5,
        });
      }

      return [];
    }
    return await this.dashboardRepository.salles.find({
      // relations: { equipments: true, subscriptions: { adherent: true }, },
      order: { createdAt: 'DESC' },
    });
  }

  async search(data: ISalleQuery): Promise<Salle> {
    try {
      let options = {};
      if (data.ids) options = { id: VIn(data.ids) }
      if (data.numero_salle) options = { numero_salle: data.numero_salle }
      return this.dashboardRepository.salles.findOneBy(options);
    } catch (error) {
      this.logger.error(error, 'ERROR::SalleService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Salle> {
    try {
      const salle = await this.dashboardRepository.salles.findOne({
        // relations: { equipments: true, subscriptions: { adherent: true }, },
        where: { id },
      });
      if (salle) {
        salle.equipments = await this.dashboardRepository.equipments.find({
          where: { salle: salle.id },
        });
        salle.subscriptions = await this.dashboardRepository.subscriptions.find({
          where: { salle: salle.id },
        });
      }
      return salle;
    } catch (error) {
      this.logger.error(error, 'ERROR::SalleService.fetchOne');
      return null as any;
    }
  }

  async add(data: ICreateSalleDTO): Promise<Salle> {
    try {
      const { numero_salle } = data;
      const existed = await this.search({ numero_salle });
      if (existed) {
        throw new ConflictException(
          'Ce numéro de salle existe déjà',
        );
      }
      const salle = await this.dashboardRepository.salles.create(
        SalleFactory.create(data),
      );
      return salle;
    } catch (error) {
      this.logger.error(error, 'ERROR::SalleService.add');
      throw error;
    }
  }

  async edit(data: IUpdateSalleDTO): Promise<Salle> {
    try {
      const { id } = data;
      const salle = await this.fetchOne(id);
      if (salle) {
        const newInstance = SalleFactory.update(salle, data);
        return await this.dashboardRepository.salles.update(newInstance);
      }
      throw new NotFoundException('Salle not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::SalleService.editUser');
      throw error;
    }
  }

  async bulk(staff: Staff, datas: ICreateSalleDTO[]): Promise<Salle[]> {
    try {
      // Vérifier si une annonce avec le même titre existe déjà
      const salles: Salle[] = [];
      if (DataHelper.isNotEmptyArray(datas)) {
        if (!staff) {
          throw new NotFoundException('Salle not found');
        }
        for (const data of datas) {
          const { numero_salle } = data;
          let queryParam: DeepQueryType<Salle> | DeepQueryType<Salle>[] = {};
          if (numero_salle) queryParam = { ...queryParam, numero_salle };
          const existingSalle = await this.dashboardRepository.salles.findOne({
            where: queryParam,
          });
          if(!existingSalle) {
            salles.push(SalleFactory.create(data));
          }
        }
      }
      if (DataHelper.isNotEmptyArray(salles)) {
        return await this.dashboardRepository.salles.createMany(salles);
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::SalleService.add');
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const salle = await this.fetchOne(id);
      if (salle) {
        return await this.dashboardRepository.salles
          .remove(salle)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::SalleService.remove');
      throw error;
    }
  }
}
