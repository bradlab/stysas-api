import { Person } from '../domain/interface/person.model';

export abstract class IBasicPersonnalInfoDTO
  implements Omit<Person, 'id' | 'createdAt' | 'updatedAt' | 'isActivated'>
{
  prenom: string;
  nom: string;
  telephone: string;
  courriel?: string;
  adresse?: string;
  matricule: number;
}