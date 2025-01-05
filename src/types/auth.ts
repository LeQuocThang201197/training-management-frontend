export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "manager" | "user";
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
