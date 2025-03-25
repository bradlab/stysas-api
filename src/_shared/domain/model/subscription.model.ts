import { ITimestamp } from 'domain/interface';
import { SalleSport, OSalle } from './salle.model';
import { Adherent, OAdherent } from './adherent.model';

export class Abonnement extends ITimestamp {
  id: string;
  date_debut: Date;
  date_fin: Date;
  actif: boolean;
  adherent?: Adherent;
  salle?: SalleSport;
}

export interface OAbonnement extends Partial<Omit<Abonnement, 'adherent' | 'salle'>> {
  adherent?: OAdherent;
  salle?: OSalle;
}
