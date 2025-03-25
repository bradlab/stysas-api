import { Carriere, OCarriere } from 'domain/model/carriere.model';
import { ICreateCarriereDTO, IUpdateCarriereDTO } from 'entraineur/carriere/carriere.service.interface';
import { EntraineurFactory } from './entraineur.factory';
import { SalleFactory } from './salle.factory';

export abstract class CarriereFactory {
  static create(data: ICreateCarriereDTO): Carriere {
    const carriere = new Carriere();
    carriere.date_debut = data.date_debut;
    carriere.date_fin = data.date_fin;
    carriere.entraineur = data.entraineurID as any;
    carriere.salle = data.salleID as any;
    return carriere;
  }

  static update(carriere: Carriere, data: IUpdateCarriereDTO): Carriere {
    carriere.date_debut = data.date_debut ?? carriere.date_debut;

    return carriere;
  }

  static getCarriere(carriere: Carriere, deep?: boolean): OCarriere {
    if (carriere) {
      return {
        id: carriere.id,
        date_debut: carriere.date_debut,
        entraineur: deep ? EntraineurFactory.getEntraineur(carriere.entraineur!) : undefined,
        salle: deep ? SalleFactory.getSalle(carriere.salle!) : undefined,
        createdAt: carriere.createdAt,
        updatedAt: carriere.updatedAt,
      };
    }
    return null as any;
  }

  static getCarrieres(carrieres: Carriere[], deep?: boolean): OCarriere[] {
    if (!carrieres) return [];
    return carrieres.map((carriere) => CarriereFactory.getCarriere(carriere, deep));
  }
}
