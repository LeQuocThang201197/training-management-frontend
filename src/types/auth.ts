export interface User {
  id: string;
  email: string;
  fullName: string;
  role: {
    id: number;
    key: string;
    value: string;
    type: string;
  };
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
