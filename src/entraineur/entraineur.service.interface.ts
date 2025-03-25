import { Entraineur } from "domain/model/coach.model";

export interface ICreateEntraineurDTO extends Omit<Entraineur, 'id' | 'createdAt' | 'updatedAt'> {
}
export interface IUpdateEntraineurDTO extends Partial<ICreateEntraineurDTO> {
  id: string;
}
export interface IEntraineurQuery extends Partial<ICreateEntraineurDTO> {
  ids?: string[];
}

// service
export abstract class IEntraineurService {
  abstract add(data: ICreateEntraineurDTO): Promise<Entraineur>;

  abstract bulk(datas: ICreateEntraineurDTO[]): Promise<Entraineur[]>;

  abstract fetchAll(param?: IEntraineurQuery): Promise<Entraineur[]>;

  abstract fetchOne(id: string): Promise<Entraineur>;

  abstract edit(data: IUpdateEntraineurDTO): Promise<Entraineur>;

  abstract remove(id: string): Promise<boolean>;
}
