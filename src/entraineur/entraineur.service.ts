import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICreateEntraineurDTO, IEntraineurService, IEntraineurQuery, IUpdateEntraineurDTO } from './entraineur.service.interface';
import { IDashboardRepository } from 'adapter/database/dashboard.repository';
import { VIn } from 'framework/orm.clauses';
import { EntraineurFactory } from 'adapter/factory/entraineur.factory';
import { DataHelper } from 'adapter/helper/data.helper';
import { DeepQueryType } from 'domain/types';
import { Entraineur } from 'domain/model/coach.model';

@Injectable()
export class EntraineurService implements IEntraineurService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
  ) {}
  
  async fetchAll(param?: IEntraineurQuery): Promise<Entraineur[]> {
    if (!DataHelper.isEmpty(param) && param) {
      let queryParam: DeepQueryType<Entraineur> | DeepQueryType<Entraineur>[] = {};
      const { ids } = param!;
      if (DataHelper.isNotEmptyArray(ids!)) {
        if (typeof ids === 'string') {
          param!.ids = [ids];
        }
        queryParam = { ...queryParam, id: VIn(param!.ids!) };
      }
      if (!DataHelper.isEmpty(queryParam)) {
        return await this.dashboardRepository.coachs.find({
          // relations: { disponibilites: true, carrieres: true, },
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
        });
      }

      return [];
    }
    return await this.dashboardRepository.coachs.find({
      // relations: { disponibilites: true, carrieres: true, },
      order: { createdAt: 'DESC' },
    });
  }

  async search(data: IEntraineurQuery): Promise<Entraineur> {
    try {
      let options = {};
      if (data.ids) options = { id: VIn(data.ids) }
      if (data.num_coach) options = {...options, num_coach: data.num_coach}
      return this.dashboardRepository.coachs.findOneBy(options);
    } catch (error) {
      this.logger.error(error, 'ERROR::EntraineurService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Entraineur> {
    try {
      return await this.dashboardRepository.coachs.findOne({
        relations: { disponibilites: true, carrieres: true, },
        where: { id },
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::EntraineurService.fetchOne');
      return null as any;
    }
  }

  async add(data: ICreateEntraineurDTO): Promise<Entraineur> {
    try {
      const { num_coach } = data;
      let existed: Entraineur;
      existed = await this.search({ num_coach });
      if (existed!) {
        throw new ConflictException(
          'Un entraineur avec le même numéro de num_coach existe déjà',
        );
      }
      const entraineur = await this.dashboardRepository.coachs.create(
        EntraineurFactory.create(data),
      );
      return entraineur;
    } catch (error) {
      this.logger.error(error, 'ERROR::EntraineurService.add');
      throw error;
    }
  }

    async bulk(datas: ICreateEntraineurDTO[]): Promise<Entraineur[]> {
      try {
        // Vérifier si une annonce avec le même titre existe déjà
        const entraineurs: Entraineur[] = [];
        if (DataHelper.isNotEmptyArray(datas)) {
          for (const data of datas) {
            const { num_coach } = data;
            const existingEntraineur = await this.search({ num_coach });
            if (!existingEntraineur) {
              entraineurs.push(EntraineurFactory.create(data));
            }
          }
        }
        if (DataHelper.isNotEmptyArray(entraineurs)) {
          return await this.dashboardRepository.coachs.createMany(entraineurs);
        }
        return [];
      } catch (error) {
        this.logger.error(error, 'ERROR::EntraineurService.bulk');
        throw error;
      }
    }

  async edit(data: IUpdateEntraineurDTO): Promise<Entraineur> {
    try {
      const { id } = data;
      const user = await this.fetchOne(id);
      if (user) {
        const userInstance = EntraineurFactory.update(user, data);
        return await this.dashboardRepository.coachs.update(userInstance);
      }
      throw new NotFoundException('Entraineur not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::EntraineurService.editUser');
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const entraineur = await this.fetchOne(id);
      if (entraineur) {
        return await this.dashboardRepository.coachs
          .remove(entraineur)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::EntraineurService.remove');
      throw error;
    }
  }
}
