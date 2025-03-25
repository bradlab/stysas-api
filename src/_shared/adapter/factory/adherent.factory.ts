import { Adherent, OAdherent } from 'domain/model/adherent.model';
import { ICreateAdherentDTO, IUpdateAdherentDTO } from 'adherent/adherent.service.interface';

export abstract class AdherentFactory {
  static create(data: ICreateAdherentDTO): Adherent {
    const adherent = new Adherent();
    adherent.courriel = data.courriel;
    adherent.telephone = data.telephone;
    adherent.courriel = data.courriel;
    adherent.telephone = data.telephone;
    adherent.prenom = data.prenom;
    adherent.nom = data.nom;
    adherent.num_membre = data.num_membre;
    adherent.poids = data.poids;
    adherent.adresse = data.adresse;
    adherent.matricule = data.matricule;
    adherent.isActivated = true;
    return adherent;
  }

  static update(adherent: Adherent, data: IUpdateAdherentDTO): Adherent {
    adherent.prenom = data.prenom ?? adherent.prenom;
    adherent.nom = data.nom ?? adherent.nom;
    adherent.adresse = data.adresse ?? adherent.adresse;
    adherent.matricule = data.matricule ?? adherent.matricule;
    adherent.num_membre = data.num_membre ?? adherent.num_membre;
    adherent.poids = data.poids ?? adherent.poids;
    adherent.courriel = data.courriel ?? adherent.courriel;
    adherent.telephone = data.telephone ?? adherent.telephone;

    return adherent;
  }

  static getAdherent(adherent: Adherent): OAdherent {
    if (adherent) {
      return {
        id: adherent.id,
        courriel: adherent.courriel,
        telephone: adherent.telephone,
        prenom: adherent.prenom,
        nom: adherent.nom,
        adresse: adherent.adresse,
        matricule: adherent.matricule,
        num_membre: adherent.num_membre,
        poids: adherent.poids,
        isActivated: adherent.isActivated,
        createdAt: adherent.createdAt,
        updatedAt: adherent.updatedAt,
      };
    }
    return null as any;
  }
}
