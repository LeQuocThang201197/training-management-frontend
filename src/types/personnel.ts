import { Concentration } from "./concentration";

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

interface Team {
  type: string;
  gender: string;
}

export interface LatestParticipation {
  role: string;
  sport: string;
  team: Team;
  concentration: Concentration;
}
