import { SalleSport as Salle, OSalle } from 'domain/model/salle.model';
import { ICreateSalleDTO, IUpdateSalleDTO } from 'salle/salle.service.interface';

export abstract class SalleFactory {
  static create(data: ICreateSalleDTO): Salle {
    const salle = new Salle();
    salle.numero_salle = data.numero_salle;
    salle.adresse_salle = data.adresse_salle;
    salle.capacite = data.capacite;
    return salle;
  }

  static update(salle: Salle, data: IUpdateSalleDTO): Salle {
    salle.numero_salle = data.numero_salle ?? salle.numero_salle;
    salle.capacite = data.capacite ?? salle.capacite;
    salle.adresse_salle = data.adresse_salle ?? salle.adresse_salle;

    return salle;
  }

  static getSalle(salle: Salle): OSalle {
    if (salle) {
      return {
        id: salle.id,
        numero_salle: salle.numero_salle,
        capacite: salle.capacite,
        adresse_salle: salle.adresse_salle,
        createdAt: salle.createdAt,
        updatedAt: salle.updatedAt,
      };
    }
    return null as any;
  }
}
