import { Team } from "./index";
import { Competition } from "./competition";

interface Creator {
  id: number;
  name: string;
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
  room: string;
  startDate: string;
  endDate: string;
  note: string;
  creator_id: number;
  createdAt: string;
  updatedAt: string;
  team: Team;
  creator: Creator;
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
