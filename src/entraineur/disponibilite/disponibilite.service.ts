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
    try {
      let disponibilites: Disponibilite[] = [];
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
          disponibilites = await this.dashboardRepository.disponibilites.find({
            // relations: { disponibilites: true, carrieres: true, },
            where: { ...queryParam },
            order: { createdAt: 'DESC' },
          });
          
        }
  
        return [];
      } else {
        disponibilites = await this.dashboardRepository.disponibilites.find({
          // relations: { disponibilites: true, carrieres: true, },
          order: { createdAt: 'DESC' },
        });
      }
  
      if (disponibilites) {
        return Promise.all(disponibilites.map(async (disponibilite) => {
          disponibilite.entraineur = await this.dashboardRepository.coachs.findOneBy({ id: disponibilite.entraineur });
          disponibilite.horaire = await this.dashboardRepository.horaires.findOneBy({ id: disponibilite.horaire });
          return disponibilite;
        }));
      }
      return disponibilites;
    } catch (error) {
      this.logger.error(error, 'ERROR::DisponibiliteService.fetchAll');
      return [];
    }
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
      const disponibilite = await this.dashboardRepository.disponibilites.findOne({
        // relations: { entraineur: true, horaire: true, },
        where: { id },
      });
      if (disponibilite) {
        disponibilite.entraineur = await this.dashboardRepository.coachs.findOneBy({ id: disponibilite.entraineur });
        disponibilite.horaire = await this.dashboardRepository.horaires.findOneBy({ id: disponibilite.horaire });
      }
      return disponibilite;
    } catch (error) {
      this.logger.error(error, 'ERROR::DisponibiliteService.fetchOne');
      return null as any;
    }
  }

  async add(data: ICreateDisponibiliteDTO): Promise<Disponibilite> {
    try {
      const { horaireID, entraineurID } = data;
      const horaire = await this.dashboardRepository.horaires.findOneBy({ id: horaireID });
      if (!horaire) {
        throw new NotFoundException('Horaire not found');
      }
      const entraineur = await this.dashboardRepository.coachs.findOneBy({ id: entraineurID });
      if (!entraineur) {
        throw new NotFoundException('Entraineur not found');
      }
      const disponibilite = await this.dashboardRepository.disponibilites.create(
        DisponibiliteFactory.create(data),
      );
      disponibilite.entraineur = entraineur;
      disponibilite.horaire = horaire;
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
