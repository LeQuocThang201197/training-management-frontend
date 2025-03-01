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

export type AbsenceType = "INACTIVE" | "LEAVE";

export interface AbsenceRecord {
  id: number;
  participantId: number;
  startDate: string;
  endDate: string;
  type: AbsenceType;
  note: string;
  createdAt: string;
  creator: {
    id: number;
    name: string;
  };
  participation: {
    id: number;
    person: {
      name: string;
    };
    role: {
      name: string;
    };
    organization: {
      name: string;
    };
  };
}

export interface Participant {
  id: number;
  person: Person;
  role: Role;
  organization: Organization;
  startDate: string;
  endDate: string;
  note: string;
  absenceRecords?: AbsenceRecord[];
  isCurrentlyAbsent?: boolean;
  currentAbsence?: AbsenceRecord;
}
