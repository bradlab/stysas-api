import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICreateEquipmentDTO, IEquipmentService, IEquipmentQuery, IUpdateEquipmentDTO } from './equipment.service.interface';
import { Equipement } from 'domain/model/equipment.model';
import { IDashboardRepository } from 'adapter/database/dashboard.repository';
import { VIn } from 'framework/orm.clauses';
import { EquipmentFactory } from 'adapter/factory/equipment.factory';
import { DataHelper } from 'adapter/helper/data.helper';
import { Staff } from 'domain/model/staff.model';
import { DeepQueryType } from 'domain/types';

@Injectable()
export class EquipmentService implements IEquipmentService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
  ) {}
  
  async fetchAll(param?: IEquipmentQuery): Promise<Equipement[]> {
    if (!DataHelper.isEmpty(param) && param) {
      let queryParam: DeepQueryType<Equipement> | DeepQueryType<Equipement>[] = {};
      const { ids } = param!;
      if (DataHelper.isNotEmptyArray(ids!)) {
        if (typeof ids === 'string') {
          param!.ids = [ids];
        }
        queryParam = { ...queryParam, id: VIn(param!.ids!) };
      }
      if (!DataHelper.isEmpty(queryParam)) {
        return await this.dashboardRepository.equipments.find({
          relations: { salle: true },
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
        });
      }

      return [];
    }
    return await this.dashboardRepository.equipments.find({
      relations: {salle: true},
      order: { createdAt: 'DESC' },
    });
  }

  async search(data: IEquipmentQuery): Promise<Equipement> {
    try {
      let options = {};
      if (data.salleID) options = { salleId: data.salleID }
      if (data.ids) options = { id: VIn(data.ids) }
      if (data.nom_equip) options = { ...options, nom_equip: data.nom_equip }
      if (data.num_equip) options = { ...options, num_equip: data.num_equip }
      return this.dashboardRepository.equipments.findOneBy(options);
    } catch (error) {
      this.logger.error(error, 'ERROR::EquipmentService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Equipement> {
    try {
      return await this.dashboardRepository.equipments.findOne({
        relations: { salle: true },
        where: { id },
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::EquipmentService.fetchOne');
      return null as any;
    }
  }

  async add(data: ICreateEquipmentDTO): Promise<Equipement> {
    try {
      const { nom_equip, salleID, num_equip } = data;
      // const existed = await this.search({ nom_equip, num_equip });
      const existed = await this.dashboardRepository.equipments.findOne({
        where: [
          { nom_equip },
          { num_equip },
        ],
      });
      if (existed!) {
        throw new ConflictException(
          'Un équipement du même nom existe déjà',
        );
      }
      const equipment = await this.dashboardRepository.equipments.create(
        EquipmentFactory.create(data),
      );
      return equipment;
    } catch (error) {
      this.logger.error(error, 'ERROR::EquipmentService.add');
      throw error;
    }
  }

  async edit(data: IUpdateEquipmentDTO): Promise<Equipement> {
    try {
      const { id } = data;
      const equipment = await this.fetchOne(id);
      if (equipment) {
        const newInstance = EquipmentFactory.update(equipment, data);
        return await this.dashboardRepository.equipments.update(newInstance);
      }
      throw new NotFoundException('Equipment not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::EquipmentService.editUser');
      throw error;
    }
  }

  async bulk(staff: Staff, datas: ICreateEquipmentDTO[]): Promise<Equipement[]> {
    try {
      // Vérifier si une annonce avec le même titre existe déjà
      const equipments: Equipement[] = [];
      if (DataHelper.isNotEmptyArray(datas)) {
        if (!staff) {
          throw new NotFoundException('Equipment not found');
        }
        for (const data of datas) {
          const { nom_equip, num_equip } = data;
          const existingEquipment = await this.dashboardRepository.equipments.findOne({
            where: [
              { nom_equip },
              { num_equip },
            ],
          });
          if (!existingEquipment) {
            equipments.push(EquipmentFactory.create(data));
          }
        }
      }
      if (DataHelper.isNotEmptyArray(equipments)) {
        return await this.dashboardRepository.equipments.createMany(equipments);
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::EquipmentService.bulk');
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const equipment = await this.fetchOne(id);
      if (equipment) {
        return await this.dashboardRepository.equipments
          .remove(equipment)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::EquipmentService.remove');
      throw error;
    }
  }
}
