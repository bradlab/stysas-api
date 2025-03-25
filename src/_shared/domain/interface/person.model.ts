import { ITimestamp } from 'domain/interface';

export class Person extends ITimestamp {
  id: string;
  matricule: number;
  nom: string;
  prenom: string;
  telephone: string;
  courriel?: string;
  adresse?: string;
  isActivated?: boolean;
}
