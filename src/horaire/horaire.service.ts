import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICreateHoraireDTO, IHoraireService, IHoraireQuery, IUpdateHoraireDTO } from './horaire.service.interface';
import { Horaire } from 'domain/model/horaire.model';
import { IDashboardRepository } from 'adapter/database/dashboard.repository';
import { VIn } from 'framework/orm.clauses';
import { HoraireFactory } from 'adapter/factory/horaire.factory';
import { DataHelper } from 'adapter/helper/data.helper';
import { DeepQueryType } from 'domain/types';

@Injectable()
export class HoraireService implements IHoraireService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
  ) {}
  
  async fetchAll(param?: IHoraireQuery): Promise<Horaire[]> {
    if (!DataHelper.isEmpty(param) && param) {
      let queryParam: DeepQueryType<Horaire> | DeepQueryType<Horaire>[] = {};
      const { ids } = param!;
      if (DataHelper.isNotEmptyArray(ids!)) {
        if (typeof ids === 'string') {
          param!.ids = [ids];
        }
        queryParam = { ...queryParam, id: VIn(param!.ids!) };
      }
      if (!DataHelper.isEmpty(queryParam)) {
        return await this.dashboardRepository.horaires.find({
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
        });
      }

      return [];
    }
    return await this.dashboardRepository.horaires.find({
      order: { createdAt: 'DESC' },
    });
  }

  async fetchOne(id: string): Promise<Horaire> {
    try {
      return await this.dashboardRepository.horaires.findOne({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::HoraireService.fetchOne');
      return null as any;
    }
  }

  async add(data: ICreateHoraireDTO): Promise<Horaire> {
    try {
      if (data.debut && data.fin) {
        return await this.dashboardRepository.horaires.create(
          HoraireFactory.create(data),
        );
      }
      throw new BadRequestException();
    } catch (error) {
      this.logger.error(error, 'ERROR::HoraireService.add');
      throw error;
    }
  }

    async bulk(datas: ICreateHoraireDTO[]): Promise<Horaire[]> {
      try {
        // Vérifier si une annonce avec le même titre existe déjà
        const horaires: Horaire[] = [];
        if (DataHelper.isNotEmptyArray(datas)) {
          for (const data of datas) {
            horaires.push(HoraireFactory.create(data));
          }
        }
        if (DataHelper.isNotEmptyArray(horaires)) {
          return await this.dashboardRepository.horaires.createMany(horaires);
        }
        return [];
      } catch (error) {
        this.logger.error(error, 'ERROR::HoraireService.bulk');
        throw error;
      }
    }

  async edit(data: IUpdateHoraireDTO): Promise<Horaire> {
    try {
      const { id } = data;
      const user = await this.fetchOne(id);
      if (user) {
        const newInstance = HoraireFactory.update(user, data);
        return await this.dashboardRepository.horaires.update(newInstance);
      }
      throw new NotFoundException('Horaire not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::HoraireService.editUser');
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const horaire = await this.fetchOne(id);
      if (horaire) {
        return await this.dashboardRepository.horaires
          .remove(horaire)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::HoraireService.remove');
      throw error;
    }
  }
}
