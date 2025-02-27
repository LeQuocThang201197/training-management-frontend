export interface Person {
  id: number;
  name: string;
  gender: string;
  code: string;
  birthday: string;
}

export interface Role {
  id: number;
  name: string;
  type: string;
  typeLabel: string;
}

export interface Organization {
  id: number;
  name: string;
}

export interface Participant {
  id: number;
  person: Person;
  role: Role;
  organization: Organization;
  startDate: string;
  endDate: string;
  note: string;
}
