import { Equipement, OEquipement } from 'domain/model/equipment.model';
import { SalleSport } from 'domain/model/salle.model';
import { ICreateEquipmentDTO, IUpdateEquipmentDTO } from 'equipment/equipment.service.interface';
import { SalleFactory } from './salle.factory';

export abstract class EquipmentFactory {
  static create(data: ICreateEquipmentDTO): Equipement {
    const equipment = new Equipement();
    equipment.fonction_equip = data.fonction_equip;
    equipment.nom_equip = data.nom_equip;
    equipment.num_equip = data.num_equip;
    equipment.quantite = data.quantite;
    equipment.salle = data.salleID as unknown as SalleSport;
    return equipment;
  }

  static update(equipment: Equipement, data: IUpdateEquipmentDTO): Equipement {
    equipment.fonction_equip = data.fonction_equip ?? equipment.fonction_equip;
    equipment.num_equip = data.num_equip ?? equipment.num_equip;
    equipment.quantite = data.quantite ?? equipment.quantite;
    equipment.nom_equip = data.nom_equip ?? equipment.nom_equip;
    equipment.salle = data.salle ?? equipment.salle;

    return equipment;
  }

  static getEquipement(equipment: Equipement, deep?: boolean): OEquipement {
    if (equipment) {
      return {
        id: equipment.id,
        fonction_equip: equipment.fonction_equip,
        nom_equip: equipment.nom_equip,
        num_equip: equipment.num_equip,
        quantite: equipment.quantite,
        salle: deep ? SalleFactory.getSalle(equipment.salle!) : undefined,
        createdAt: equipment.createdAt,
        updatedAt: equipment.updatedAt,
      };
    }
    return null as any;
  }

  static getEquipments(equipments: Equipement[], deep?: boolean): OEquipement[] {
    return equipments.map((equipment) => this.getEquipement(equipment, deep));
  }
}
