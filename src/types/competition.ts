export interface Competition {
  id: number;
  name: string;
  location: string;
  isForeign: boolean;
  startDate: string;
  endDate: string;
  note?: string;
  is_confirmed: boolean;
  created_by: number;
  creator: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  participantStats: {
    ATHLETE: number;
    COACH: number;
    SPECIALIST: number;
    OTHER: number;
  };
  totalParticipants: number;
  concentrations?: CompetitionConcentration[];
}

export interface CompetitionConcentration {
  competition_id: number;
  concentration_id: number;
  createdAt: string;
  concentration: {
    id: number;
    location: string;
    startDate: string;
    endDate: string;
    team: {
      sport: {
        name: string;
      };
      type: string;
      gender: string;
    };
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
