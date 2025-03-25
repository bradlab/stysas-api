import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICreateCarriereDTO, ICarriereService, ICarriereQuery, IUpdateCarriereDTO } from './carriere.service.interface';
import { IDashboardRepository } from 'adapter/database/dashboard.repository';
import { VEqual, VIn } from 'framework/orm.clauses';
import { CarriereFactory } from 'adapter/factory/carriere.factory';
import { DataHelper } from 'adapter/helper/data.helper';
import { DeepQueryType } from 'domain/types';
import { Carriere } from 'domain/model/carriere.model';

@Injectable()
export class CarriereService implements ICarriereService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
  ) {}
  
  async fetchAll(param?: ICarriereQuery): Promise<Carriere[]> {
    if (!DataHelper.isEmpty(param) && param) {
      let queryParam: DeepQueryType<Carriere> | DeepQueryType<Carriere>[] = {};
      const { ids } = param!;
      if (DataHelper.isNotEmptyArray(ids!)) {
        if (typeof ids === 'string') {
          param!.ids = [ids];
        }
        queryParam = { ...queryParam, id: VIn(param!.ids!) };
      }
      if (!DataHelper.isEmpty(queryParam)) {
        return await this.dashboardRepository.carrieres.find({
          // relations: { carrieres: true, carrieres: true, },
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
        });
      }

      return [];
    }
    return await this.dashboardRepository.carrieres.find({
      // relations: { carrieres: true, carrieres: true, },
      order: { createdAt: 'DESC' },
    });
  }

  async search(data: ICarriereQuery): Promise<Carriere> {
    try {
      let options = {};
      if (data.ids) options = { id: VIn(data.ids) }
      if (data.salleID) options = {...options, salleId: data.salleID}
      if (data.entraineurID) options = {...options, entraineurId: data.entraineurID}
      return this.dashboardRepository.carrieres.findOneBy(options);
    } catch (error) {
      this.logger.error(error, 'ERROR::CarriereService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Carriere> {
    try {
      return await this.dashboardRepository.carrieres.findOne({
        relations: { entraineur: true, salle: true, },
        where: { id },
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::CarriereService.fetchOne');
      return null as any;
    }
  }

  async add(data: ICreateCarriereDTO): Promise<Carriere> {
    try {
      const { salleID, entraineurID } = data;
      let existed: Carriere;
      existed = await this.search({ salleID, entraineurID });
      if (existed!) {
        throw new ConflictException(
          "Cette carriere existe déjà pour l'entraineur",
        );
      }
      const carriere = await this.dashboardRepository.carrieres.create(
        CarriereFactory.create(data),
      );
      return carriere;
    } catch (error) {
      this.logger.error(error, 'ERROR::CarriereService.add');
      throw error;
    }
  }

  async edit(data: IUpdateCarriereDTO): Promise<Carriere> {
    try {
      const { id } = data;
      const carriere = await this.fetchOne(id);
      if (carriere) {
        const userInstance = CarriereFactory.update(carriere, data);
        return await this.dashboardRepository.carrieres.update(userInstance);
      }
      throw new NotFoundException('Carriere not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::CarriereService.editUser');
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const carriere = await this.fetchOne(id);
      if (carriere) {
        return await this.dashboardRepository.carrieres
          .remove(carriere)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::CarriereService.remove');
      throw error;
    }
  }
}
