import { Disponibilite } from "domain/model/disponibilite.model";

export interface IDisponibiliteQuery extends Partial<ICreateDisponibiliteDTO> {
  ids?: string[];
}

// disponibilite
export interface ICreateDisponibiliteDTO extends Pick<Disponibilite, 'date_dispo' | 'entraineur' | 'horaire'> {
  entraineurID: string;
  horaireID: string;
}

export interface IUpdateDisponibiliteDTO extends Partial<ICreateDisponibiliteDTO> {
  id: string;
}

// service
export abstract class IDisponibiliteService {
  abstract add(data: ICreateDisponibiliteDTO): Promise<Disponibilite>;

  abstract fetchAll(param?: IDisponibiliteQuery): Promise<Disponibilite[]>;

  abstract fetchOne(id: string): Promise<Disponibilite>;

  abstract edit(data: IUpdateDisponibiliteDTO): Promise<Disponibilite>;

  abstract remove(id: string): Promise<boolean>;
}
