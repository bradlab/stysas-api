import { Abonnement, OAbonnement } from 'domain/model/subscription.model';
import { ICreateAbonnementDTO, IUpdateAbonnementDTO } from 'abonnement/abonnement.service.interface';
import { OAdherent } from 'domain/model/adherent.model';
import { OSalle } from 'domain/model/salle.model';

export abstract class AbonnementFactory {
  static create(data: ICreateAbonnementDTO): Abonnement {
    const abonnement = new Abonnement();
    abonnement.date_debut = data.date_debut;
    abonnement.date_fin = data.date_fin;
    abonnement.adherent = data.adherent;
    abonnement.salle = data.salle;
    abonnement.actif = data.actif ?? true;
    return abonnement;
  }

  static update(abonnement: Abonnement, data: IUpdateAbonnementDTO): Abonnement {
    abonnement.date_debut = data.date_debut ?? abonnement.date_debut;
    abonnement.adherent = data.adherent ?? abonnement.adherent;
    abonnement.salle = data.salle ?? abonnement.salle;
    abonnement.date_fin = data.date_fin ?? abonnement.date_fin;

    return abonnement;
  }

  static getAbonnement(abonnement: Abonnement): OAbonnement {
    if (abonnement) {
      return {
        id: abonnement.id,
        date_debut: abonnement.date_debut,
        date_fin: abonnement.date_fin,
        adherent: abonnement.adherent as OAdherent,
        salle: abonnement.salle as OSalle,
        actif: abonnement.actif,
        createdAt: abonnement.createdAt,
        updatedAt: abonnement.updatedAt,
      };
    }
    return null as any;
  }
}
