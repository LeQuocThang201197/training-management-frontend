import { createContext } from "react";
import { AuthState } from "../types/auth";

interface AuthContextType extends AuthState {
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  register: (userData: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
