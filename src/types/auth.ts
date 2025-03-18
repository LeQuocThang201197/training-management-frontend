export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Instead of hardcoding, define a type for permissions
export type Permission = string;
