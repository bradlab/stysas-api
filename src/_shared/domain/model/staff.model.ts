import { Person } from 'domain/interface/person.model';

export class Staff extends Person {
  id: string;
  password: string;
  code?: string;
  isActivated?: boolean;
  avatar?: string;
  // relation
}

export interface OStaff extends Partial<Staff> {
  id: string;
  fullname: string;
}

export interface SignedStaff extends OStaff {
  accessToken: string;
}
