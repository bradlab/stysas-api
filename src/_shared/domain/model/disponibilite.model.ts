import { ITimestamp } from 'domain/interface';
import { Entraineur, OEntraineur } from './coach.model';
import { Horaire, OHoraire } from './horaire.model';

export class Disponibilite extends ITimestamp {
  id: string;
  date_dispo: Date;
  horaire?: Horaire;
  entraineur?: Entraineur;
}

export interface ODisponibilite extends Partial<Omit<Disponibilite, 'entraineur'|'horaire'>> {
  entraineur?: OEntraineur;
  horaire?: OHoraire;
}
