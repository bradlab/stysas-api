import { Carriere } from "domain/model/carriere.model";
import { Entraineur } from "domain/model/coach.model";
import { SalleSport } from "domain/model/salle.model";

// carrière
export interface ICreateCarriereDTO extends Omit<Carriere, 'id' | 'createdAt' | 'updatedAt'> {
  entraineurID: string;
  salleID: string;

  //
  salle?: SalleSport;
  entraineur?: Entraineur;
}

export interface IUpdateCarriereDTO extends Partial<ICreateCarriereDTO> {
  id: string;
}

export interface ICarriereQuery extends Partial<ICreateCarriereDTO> {
  ids?: string[];
}

// service
export abstract class ICarriereService {
  abstract add(data: ICreateCarriereDTO): Promise<Carriere>;

  abstract fetchAll(param?: ICarriereQuery): Promise<Carriere[]>;

  abstract fetchOne(id: string): Promise<Carriere>;

  abstract edit(data: IUpdateCarriereDTO): Promise<Carriere>;

  abstract remove(id: string): Promise<boolean>;
}
