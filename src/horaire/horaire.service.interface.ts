import { Horaire } from 'domain/model/horaire.model';

export interface ICreateHoraireDTO extends Omit<Horaire, 'id' | 'createdAt' | 'updatedAt'> {
}
export interface IUpdateHoraireDTO extends Partial<ICreateHoraireDTO> {
  id: string;
}

export interface IHoraireQuery extends Partial<ICreateHoraireDTO> {
  ids?: string[];
}

export abstract class IHoraireService {
  abstract add(data: ICreateHoraireDTO): Promise<Horaire>;

  abstract bulk(datas: ICreateHoraireDTO[]): Promise<Horaire[]>

  abstract fetchAll(param?: IHoraireQuery): Promise<Horaire[]>;

  abstract fetchOne(id: string): Promise<Horaire>;

  abstract edit(data: IUpdateHoraireDTO): Promise<Horaire>;

  abstract remove(id: string): Promise<boolean>;
}
