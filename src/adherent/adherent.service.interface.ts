import { Person } from 'domain/interface/person.model';
import { Adherent } from 'domain/model/adherent.model';
import { Staff } from 'domain/model/staff.model';
import { PartialDeep } from 'domain/types';

export interface ICreateAdherentDTO extends Omit<Person, 'id' | 'createdAt' | 'updatedAt'> {
  num_membre: number;
  poids: number;
}
export interface IUpdateAdherentDTO extends Partial<ICreateAdherentDTO> {
  id: string;
}

export interface IAdherentQuery extends Partial<ICreateAdherentDTO> {
  ids?: string[];
}

export abstract class IAdherentService {
  abstract add(data: ICreateAdherentDTO): Promise<Adherent>;

  abstract fetchAll(param?: Partial<Adherent>): Promise<Adherent[]>;

  abstract search(
    data: PartialDeep<Adherent>,
    withAccess?: boolean,
  ): Promise<Adherent>;

  abstract bulk(staff: Staff, datas: ICreateAdherentDTO[]): Promise<Adherent[]>;

  abstract fetchOne(id: string): Promise<Adherent>;

  abstract edit(data: IUpdateAdherentDTO): Promise<Adherent>;

  abstract remove(id: string): Promise<boolean>;

  abstract clean(): Promise<boolean>;
}
