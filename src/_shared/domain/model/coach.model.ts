import { Person } from 'domain/interface/person.model';
import { Carriere, OCarriere } from './carriere.model';
import { Disponibilite, ODisponibilite } from './disponibilite.model';

export class Entraineur extends Person {
  num_coach: number;
  specialite: string;
  date_emb: Date;
  sal_base: number;
  carrieres?: Carriere[];
  disponibilites?: Disponibilite[];
}

export interface OEntraineur
  extends Partial<Omit<Entraineur, 'carrieres'|'disponibilites'>> {
  carrieres?: OCarriere[];
  disponibilites?: ODisponibilite[];
}
