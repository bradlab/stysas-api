import { Person } from 'domain/interface/person.model';
import { Abonnement, OAbonnement } from './subscription.model';

export class Adherent extends Person {
  num_membre: number;
  poids: number;
  subscriptions?: Abonnement[];
}

export interface OAdherent extends Partial<Omit<Adherent, 'subscriptions'>> {
  subscriptions?: OAbonnement[];
  nbrSubscription?: number;
}
