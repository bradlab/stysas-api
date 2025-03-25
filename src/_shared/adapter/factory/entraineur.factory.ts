import { OCarriere } from 'domain/model/carriere.model';
import { Entraineur, OEntraineur } from 'domain/model/coach.model';
import { ODisponibilite } from 'domain/model/disponibilite.model';
import { ICreateEntraineurDTO, IUpdateEntraineurDTO } from 'entraineur/entraineur.service.interface';

export abstract class EntraineurFactory {
  static create(data: ICreateEntraineurDTO): Entraineur {
    const entraineur = new Entraineur();
    entraineur.courriel = data.courriel;
    entraineur.telephone = data.telephone;
    entraineur.courriel = data.courriel;
    entraineur.telephone = data.telephone;
    entraineur.prenom = data.prenom;
    entraineur.nom = data.nom;
    entraineur.num_coach = data.num_coach;
    entraineur.specialite = data.specialite;
    entraineur.date_emb = data.date_emb;
    entraineur.sal_base = data.sal_base;
    entraineur.adresse = data.adresse;
    entraineur.matricule = data.matricule;
    entraineur.isActivated = true;
    return entraineur;
  }

  static update(entraineur: Entraineur, data: IUpdateEntraineurDTO): Entraineur {
    entraineur.prenom = data.prenom ?? entraineur.prenom;
    entraineur.nom = data.nom ?? entraineur.nom;
    entraineur.adresse = data.adresse ?? entraineur.adresse;
    entraineur.matricule = data.matricule ?? entraineur.matricule;
    entraineur.num_coach = data.num_coach ?? entraineur.num_coach;
    entraineur.specialite = data.specialite ?? entraineur.specialite;
    entraineur.specialite = data.specialite ?? entraineur.specialite;
    entraineur.specialite = data.specialite ?? entraineur.specialite;
    entraineur.date_emb = data.date_emb ?? entraineur.date_emb;
    entraineur.sal_base = data.sal_base ?? entraineur.sal_base;
    entraineur.courriel = data.courriel ?? entraineur.courriel;
    entraineur.telephone = data.telephone ?? entraineur.telephone;

    return entraineur;
  }

  static getEntraineur(entraineur: Entraineur): OEntraineur {
    if (entraineur) {
      return {
        id: entraineur.id,
        courriel: entraineur.courriel,
        telephone: entraineur.telephone,
        prenom: entraineur.prenom,
        nom: entraineur.nom,
        adresse: entraineur.adresse,
        matricule: entraineur.matricule,
        num_coach: entraineur.num_coach,
        specialite: entraineur.specialite,
        date_emb: entraineur.date_emb,
        sal_base: entraineur.sal_base,
        carrieres: entraineur.carrieres as OCarriere[], // TODO
        disponibilites: entraineur.disponibilites as ODisponibilite[],
        isActivated: entraineur.isActivated,
        createdAt: entraineur.createdAt,
        updatedAt: entraineur.updatedAt,
      };
    }
    return null as any;
  }
}
