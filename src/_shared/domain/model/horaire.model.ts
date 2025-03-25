import { ITimestamp } from 'domain/interface';
import { Disponibilite, ODisponibilite } from './disponibilite.model';

export class Horaire extends ITimestamp {
  id: string;
  debut: number;  // Temps représenté en heures (e.g., 9.5 for 9:30)
  fin: number;    // Temps représenté en heure
  disponibilites?: Disponibilite[];
}

export interface OHoraire extends Partial<Omit<Horaire, 'disponibilites'>> {
  disponibilites?: ODisponibilite[];
}
