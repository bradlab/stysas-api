import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICreateDisponibiliteDTO, IDisponibiliteService, IDisponibiliteQuery, IUpdateDisponibiliteDTO } from './disponibilite.service.interface';
import { IDashboardRepository } from 'adapter/database/dashboard.repository';
import { VEqual, VIn } from 'framework/orm.clauses';
import { DisponibiliteFactory } from 'adapter/factory/disponibilite.factory';
import { DataHelper } from 'adapter/helper/data.helper';
import { DeepQueryType } from 'domain/types';
import { Disponibilite } from 'domain/model/disponibilite.model';

@Injectable()
export class DisponibiliteService implements IDisponibiliteService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
  ) {}
  
  async fetchAll(param?: IDisponibiliteQuery): Promise<Disponibilite[]> {
    if (!DataHelper.isEmpty(param) && param) {
      let queryParam: DeepQueryType<Disponibilite> | DeepQueryType<Disponibilite>[] = {};
      const { ids } = param!;
      if (DataHelper.isNotEmptyArray(ids!)) {
        if (typeof ids === 'string') {
          param!.ids = [ids];
        }
        queryParam = { ...queryParam, id: VIn(param!.ids!) };
      }
      if (!DataHelper.isEmpty(queryParam)) {
        return await this.dashboardRepository.disponibilites.find({
          // relations: { disponibilites: true, carrieres: true, },
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
        });
      }

      return [];
    }
    return await this.dashboardRepository.disponibilites.find({
      // relations: { disponibilites: true, carrieres: true, },
      order: { createdAt: 'DESC' },
    });
  }

  async search(data: IDisponibiliteQuery): Promise<Disponibilite> {
    try {
      let options = {};
      if (data.ids) options = { id: VIn(data.ids) }
      if (data.date_dispo) options = {...options, date_dispo: VEqual(data.date_dispo)}
      if (data.horaireID) options = {...options, horaireId: data.horaireID}
      if (data.entraineurID) options = {...options, entraineurId: data.entraineurID}
      return this.dashboardRepository.disponibilites.findOneBy(options);
    } catch (error) {
      this.logger.error(error, 'ERROR::DisponibiliteService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Disponibilite> {
    try {
      return await this.dashboardRepository.disponibilites.findOne({
        relations: { entraineur: true, horaire: true, },
        where: { id },
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::DisponibiliteService.fetchOne');
      return null as any;
    }
  }

  async add(data: ICreateDisponibiliteDTO): Promise<Disponibilite> {
    try {
      const { horaireID, entraineurID, date_dispo } = data;
      let existed: Disponibilite;
      existed = await this.search({ horaireID, entraineurID });
      if (existed!) {
        throw new ConflictException(
          "Cette disponibilite existe déjà pour l'entraineur",
        );
      }
      const disponibilite = await this.dashboardRepository.disponibilites.create(
        DisponibiliteFactory.create(data),
      );
      return disponibilite;
    } catch (error) {
      this.logger.error(error, 'ERROR::DisponibiliteService.add');
      throw error;
    }
  }

  async edit(data: IUpdateDisponibiliteDTO): Promise<Disponibilite> {
    try {
      const { id } = data;
      const disponibilite = await this.fetchOne(id);
      if (disponibilite) {
        const userInstance = DisponibiliteFactory.update(disponibilite, data);
        return await this.dashboardRepository.disponibilites.update(userInstance);
      }
      throw new NotFoundException('Disponibilite not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::DisponibiliteService.editUser');
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const disponibilite = await this.fetchOne(id);
      if (disponibilite) {
        return await this.dashboardRepository.disponibilites
          .remove(disponibilite)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::DisponibiliteService.remove');
      throw error;
    }
  }
}
