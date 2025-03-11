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
