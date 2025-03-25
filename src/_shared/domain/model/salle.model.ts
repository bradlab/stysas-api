import { ITimestamp } from 'domain/interface';
import { Abonnement, OAbonnement } from './subscription.model';
import { Equipement, OEquipement } from './equipment.model';

export class SalleSport extends ITimestamp {
  id: string;
  numero_salle: number;
  adresse_salle: string;
  capacite: number;
  // relations or pointer
  equipments?: Equipement[];
  subscriptions?: Abonnement[];
}

export interface OSalle extends Partial<Omit<SalleSport, 'subscriptions'|'equipments'>> {
  subscriptions?: OAbonnement[];
  equipments?: OEquipement[];
}
