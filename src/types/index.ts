export interface Document {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  tags: string[];
  description: string;
}

export interface Team {
  id: number;
  sportId: number;
  type: string; // "ADULT" | "JUNIOR" | "DISABILITY"
  gender: string; // "MALE" | "FEMALE" | "MIXED"
  createdAt: string;
  updatedAt: string;
  sport: {
    id: number;
    name: string;
  };
  sportName: string;
  typeLabel: string;
  genderLabel: string;
}

export * from "./concentration";
export * from "./auth";
