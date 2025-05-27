// Base interfaces for both list and detail
interface Team {
  id: number;
  sport: string;
  type: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  rawData: {
    sportId: number;
    type: string;
    gender: string;
  };
}

interface Role {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface Organization {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: number;
  type: "TRAINING" | "COMPETITION";
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  location: string;
  result?: string;
}

interface Creator {
  id: number;
  name: string;
}

interface Training {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  note?: string;
}

interface Competition {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  isForeign: boolean;
  is_confirmed: boolean;
  note?: string;
}

interface Concentration {
  id: number;
  location: string;
  startDate: string;
  endDate: string;
  team: Team;
  trainings: Training[];
  competitions: Competition[];
}

interface DetailParticipation {
  id: number;
  person_id: number;
  concentration_id: number;
  role_id: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  organization_id: number;
  assigned_by: number;
  concentration: Concentration;
  role: Role;
  organization: Organization;
  activities?: Activity[];
}

// For personnel list view
export interface LatestParticipation {
  role: string;
  sport: string;
  team: Pick<Team, "type" | "gender">;
  concentration: Concentration;
}

// Base person interface
export interface Person {
  id: number;
  name: string;
  identity_number: string | null;
  identity_date: string | null;
  identity_place: string | null;
  social_insurance: string | null;
  birthday: string;
  gender: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  created_by: number;
  latest_participation?: LatestParticipation;
}

// Extended person interface for detail view
export interface PersonDetail extends Person {
  creator: Creator;
  participations: DetailParticipation[];
}

export interface PersonFormData {
  name: string;
  identity_number: string | null;
  identity_date: string | null;
  identity_place: string | null;
  social_insurance: string | null;
  birthday: string;
  gender: string;
  phone: string | null;
  email: string | null;
}
