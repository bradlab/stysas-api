import { ITimestamp } from 'domain/interface';
import { OSalle, SalleSport } from './salle.model';

export class Equipement extends ITimestamp {
  id: string;
  num_equip: number;
  nom_equip: string;
  fonction_equip: string;
  quantite: number;
  salle?: SalleSport;
}

export interface OEquipement extends Partial<Omit<Equipement, 'salle'>> {
  salle?: OSalle[];
}
