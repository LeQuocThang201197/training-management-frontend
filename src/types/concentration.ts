import { Team } from "./index";

interface Submitter {
  id: number;
  username: string;
  email: string;
}

export interface ParticipantStats {
  ATHLETE: number;
  COACH: number;
  SPECIALIST: number;
  OTHER: number;
}

export interface Concentration {
  id: number;
  teamId: number;
  sequence_number: number;
  related_year: number;
  location: string;
  startDate: string;
  endDate: string;
  note: string;
  submitter_id: number;
  createdAt: string;
  updatedAt: string;
  team: Team;
  submitter: Submitter;
  participantStats: ParticipantStats;
}
