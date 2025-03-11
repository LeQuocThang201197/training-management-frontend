import { Team } from "./index";
import { Competition } from "./competition";

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
  trainings: {
    id: number;
    location: string;
    isForeign: boolean;
    startDate: string;
    endDate: string;
    note: string;
    participantStats: ParticipantStats;
  }[];
  competitions: Competition[];
}
