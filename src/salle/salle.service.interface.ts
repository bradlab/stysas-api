import { SalleSport as Salle } from 'domain/model/salle.model';
import { Staff } from 'domain/model/staff.model';

export interface ICreateSalleDTO extends Omit<Salle, 'id' | 'createdAt' | 'updatedAt'> {
}
export interface IUpdateSalleDTO extends Partial<ICreateSalleDTO> {
  id: string;
}

export interface ISalleQuery extends Partial<ICreateSalleDTO> {
  ids?: string[];
}

export abstract class ISalleService {
  abstract add(data: ICreateSalleDTO): Promise<Salle>;

  abstract bulk(staff: Staff, datas: ICreateSalleDTO[]): Promise<Salle[]>;

  abstract fetchAll(param?: ISalleQuery): Promise<Salle[]>;

  abstract fetchOne(id: string): Promise<Salle>;

  abstract edit(data: IUpdateSalleDTO): Promise<Salle>;

  abstract remove(id: string): Promise<boolean>;
}
