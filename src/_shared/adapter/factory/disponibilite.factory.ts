import { Disponibilite, ODisponibilite } from 'domain/model/disponibilite.model';
import { ICreateDisponibiliteDTO, IUpdateDisponibiliteDTO } from 'entraineur/disponibilite/disponibilite.service.interface';
import { EntraineurFactory } from './entraineur.factory';
import { HoraireFactory } from './horaire.factory';

export abstract class DisponibiliteFactory {
  static create(data: ICreateDisponibiliteDTO): Disponibilite {
    const disponibilite = new Disponibilite();
    disponibilite.date_dispo = data.date_dispo;
    disponibilite.entraineur = data.entraineurID as any;
    disponibilite.horaire = data.horaireID as any;
    return disponibilite;
  }

  static update(disponibilite: Disponibilite, data: IUpdateDisponibiliteDTO): Disponibilite {
    disponibilite.date_dispo = data.date_dispo ?? disponibilite.date_dispo;

    return disponibilite;
  }

  static getDisponibilite(disponibilite: Disponibilite, deep?: boolean): ODisponibilite {
    if (disponibilite && typeof disponibilite != 'string') {
      return {
        id: disponibilite.id,
        date_dispo: disponibilite.date_dispo,
        entraineur: deep ? EntraineurFactory.getEntraineur(disponibilite.entraineur!) : undefined,
        horaire: deep ? HoraireFactory.getHoraire(disponibilite.horaire!) : undefined,
        createdAt: disponibilite.createdAt,
        updatedAt: disponibilite.updatedAt,
      };
    }
    return null as any;
  }

  static getDisponibilites(disponibilites: Disponibilite[], deep?: boolean): ODisponibilite[] {
    if (!disponibilites) return [];
    return disponibilites.map((disponibilite) => DisponibiliteFactory.getDisponibilite(disponibilite, deep));
  }
}
