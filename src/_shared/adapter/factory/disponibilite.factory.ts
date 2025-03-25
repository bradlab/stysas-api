import { Disponibilite, ODisponibilite } from 'domain/model/disponibilite.model';
import { ICreateDisponibiliteDTO, IUpdateDisponibiliteDTO } from 'entraineur/disponibilite/disponibilite.service.interface';
import { EntraineurFactory } from './entraineur.factory';
import { HoraireFactory } from './horaire.factory';

export abstract class DisponibiliteFactory {
  static create(data: ICreateDisponibiliteDTO): Disponibilite {
    const disponibilite = new Disponibilite();
    disponibilite.date_dispo = data.date_dispo;
    disponibilite.entraineur = data.entraineur;
    disponibilite.horaire = data.horaire;
    return disponibilite;
  }

  static update(disponibilite: Disponibilite, data: IUpdateDisponibiliteDTO): Disponibilite {
    disponibilite.date_dispo = data.date_dispo ?? disponibilite.date_dispo;

    return disponibilite;
  }

  static getDisponibilite(disponibilite: Disponibilite): ODisponibilite {
    if (disponibilite) {
      return {
        id: disponibilite.id,
        date_dispo: disponibilite.date_dispo,
        entraineur: EntraineurFactory.getEntraineur(disponibilite.entraineur!),
        horaire: HoraireFactory.getHoraire(disponibilite.horaire!),
        createdAt: disponibilite.createdAt,
        updatedAt: disponibilite.updatedAt,
      };
    }
    return null as any;
  }
}
