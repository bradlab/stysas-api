import { ITimestamp } from 'domain/interface';
import { Entraineur, OEntraineur } from './coach.model';
import { OSalle, SalleSport } from './salle.model';

export class Carriere extends ITimestamp{
  id: string;
  date_debut: Date;
  date_fin: Date;
  salle?: SalleSport;
  entraineur?: Entraineur;
}

export interface OCarriere extends Partial<Omit<Carriere, 'entraineur'|'salle'>> {
  entraineur?: OEntraineur;
  salle?: OSalle;
}
