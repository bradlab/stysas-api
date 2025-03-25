import { Equipement } from 'domain/model/equipment.model';
import { Staff } from 'domain/model/staff.model';

export interface ICreateEquipmentDTO extends Omit<Equipement, 'id' | 'createdAt' | 'updatedAt'> {
  salleID: string;
}
export interface IUpdateEquipmentDTO extends Partial<ICreateEquipmentDTO> {
  id: string;
}

export interface IEquipmentQuery extends Partial<ICreateEquipmentDTO> {
  ids?: string[];
}

export abstract class IEquipmentService {
  abstract add(data: ICreateEquipmentDTO): Promise<Equipement>;

  abstract bulk(staff: Staff, datas: ICreateEquipmentDTO[]): Promise<Equipement[]>;

  abstract fetchAll(param?: IEquipmentQuery): Promise<Equipement[]>;

  abstract fetchOne(id: string): Promise<Equipement>;

  abstract edit(data: IUpdateEquipmentDTO): Promise<Equipement>;

  abstract remove(id: string): Promise<boolean>;
}
