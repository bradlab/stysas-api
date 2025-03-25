import { Abonnement } from "domain/model/subscription.model";

export interface ICreateAbonnementDTO extends Omit<Abonnement, 'id' | 'actif' | 'createdAt' | 'updatedAt'> {
  adherentID: string;
  salleID: string;
  actif?: boolean;
}
export interface IUpdateAbonnementDTO extends Partial<ICreateAbonnementDTO> {
  id: string;
}

export interface IAbonnementQuery extends Partial<ICreateAbonnementDTO> {
  ids?: string[];
}

export abstract class IAbonnemntService {
  abstract add(data: ICreateAbonnementDTO): Promise<Abonnement>;

  abstract fetchAll(param?: IAbonnementQuery): Promise<Abonnement[]>;

  abstract fetchOne(id: string): Promise<Abonnement>;

  abstract edit(data: IUpdateAbonnementDTO): Promise<Abonnement>;

  abstract setState(ids: string[]): Promise<boolean>;

  abstract remove(id: string): Promise<boolean>;
}
