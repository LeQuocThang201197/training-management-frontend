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
    room: string;
    related_year: number;
    sequence_number: number;
    note: string;
    team: {
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
    };
    trainings: {
      id: number;
      location: string;
      isForeign: boolean;
      startDate: string;
      endDate: string;
      note: string;
      participantStats: {
        ATHLETE: number;
        COACH: number;
        SPECIALIST: number;
        OTHER: number;
      };
    }[];
    participantStats: {
      ATHLETE: number;
      COACH: number;
      SPECIALIST: number;
      OTHER: number;
    };
    competitions: Competition[];
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
  competition_id: number;
  participant_id: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  endDate: string;
  startDate: string;
  created_by: number;
  participation: {
    id: number;
    person_id: number;
    concentration_id: number;
    role_id: number;
    note: string;
    createdAt: string;
    updatedAt: string;
    organization_id: number;
    assigned_by: number;
    person: {
      id: number;
      name: string;
      name_search: string;
      identity_number: string | null;
      identity_date: string | null;
      identity_place: string;
      social_insurance: string | null;
      birthday: string;
      phone: string | null;
      email: string | null;
      gender: string;
      created_by: number;
      createdAt: string;
      updatedAt: string;
    };
    role: {
      id: number;
      name: string;
      type: string;
      createdAt: string;
      updatedAt: string;
    };
    concentration: {
      id: number;
      teamId: number;
      location: string;
      startDate: string;
      endDate: string;
      note: string;
      created_by: number;
      createdAt: string;
      updatedAt: string;
      related_year: number;
      sequence_number: number;
      room: string;
      team: {
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
      };
    };
    organization: {
      id: number;
      name: string;
      type: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  creator: {
    id: number;
    name: string;
  };
}

export interface CompetitionParticipantResponse {
  participants: CompetitionParticipantDetail[];
  stats: {
    ATHLETE: number;
    COACH: number;
    SPECIALIST: number;
    OTHER: number;
  };
}
