import { Horaire, OHoraire } from 'domain/model/horaire.model';
import { ICreateHoraireDTO, IUpdateHoraireDTO } from 'horaire/horaire.service.interface';

export abstract class HoraireFactory {
  static create(data: ICreateHoraireDTO): Horaire {
    const horaire = new Horaire();
    horaire.debut = data.debut;
    horaire.fin = data.fin;
    return horaire;
  }

  static update(horaire: Horaire, data: IUpdateHoraireDTO): Horaire {
    horaire.debut = data.debut ?? horaire.debut;
    horaire.fin = data.fin ?? horaire.fin;

    return horaire;
  }

  static getHoraire(horaire: Horaire): OHoraire {
    if (horaire) {
      return {
        id: horaire.id,
        debut: horaire.debut,
        fin: horaire.fin,
        createdAt: horaire.createdAt,
        updatedAt: horaire.updatedAt,
      };
    }
    return null as any;
  }
}
