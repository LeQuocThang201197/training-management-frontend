export interface Document {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published";
  tags: string[];
  description?: string;
}
