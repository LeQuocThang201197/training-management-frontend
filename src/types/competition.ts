export interface Competition {
  id: number;
  name: string;
  location: string;
  isForeign: boolean;
  startDate: string;
  endDate: string;
  note?: string;
  is_confirmed: boolean;
  participantStats: {
    ATHLETE: number;
    COACH: number;
    SPECIALIST: number;
    OTHER: number;
  };
}

export interface CompetitionFormData {
  name: string;
  location: string;
  isForeign: boolean;
  startDate: string;
  endDate: string;
  note?: string;
  is_confirmed: boolean;
  concentration_id: string;
}

export interface CompetitionParticipantDetail {
  participation_id: number;
  startDate: string;
  endDate: string;
  note?: string;
}

export interface CompetitionParticipantResponse {
  participants: {
    participation_id: number;
    startDate: string;
    endDate: string;
    note?: string;
  }[];
  stats: {
    ATHLETE: number;
    COACH: number;
    SPECIALIST: number;
    OTHER: number;
  };
}
