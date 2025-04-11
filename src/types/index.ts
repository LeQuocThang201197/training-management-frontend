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

export * from "./concentration";
export * from "./auth";
