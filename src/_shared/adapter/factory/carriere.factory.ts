import { Carriere, OCarriere } from 'domain/model/carriere.model';
import { ICreateCarriereDTO, IUpdateCarriereDTO } from 'entraineur/carriere/carriere.service.interface';
import { EntraineurFactory } from './entraineur.factory';
import { SalleFactory } from './salle.factory';

export abstract class CarriereFactory {
  static create(data: ICreateCarriereDTO): Carriere {
    const carriere = new Carriere();
    carriere.date_debut = data.date_debut;
    carriere.date_fin = data.date_fin;
    carriere.entraineur = data.entraineur;
    carriere.salle = data.salle;
    return carriere;
  }

  static update(carriere: Carriere, data: IUpdateCarriereDTO): Carriere {
    carriere.date_debut = data.date_debut ?? carriere.date_debut;

    return carriere;
  }

  static getCarriere(carriere: Carriere): OCarriere {
    if (carriere) {
      return {
        id: carriere.id,
        date_debut: carriere.date_debut,
        entraineur: EntraineurFactory.getEntraineur(carriere.entraineur!),
        salle: SalleFactory.getSalle(carriere.salle!),
        createdAt: carriere.createdAt,
        updatedAt: carriere.updatedAt,
      };
    }
    return null as any;
  }
}
