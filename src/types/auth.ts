export interface User {
  id: number;
  email: string;
  name: string;
  roles: {
    role: {
      id: number;
      name: string;
      description: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Instead of hardcoding, define a type for permissions
export type Permission = string;
