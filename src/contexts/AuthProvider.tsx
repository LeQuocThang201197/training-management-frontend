import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { AuthState } from "../types/auth";
import { API_URL, API_ENDPOINTS } from "../config/api";
import { Permission, Role, RolePermissions } from "../types/auth";
import Cookies from "js-cookie";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState & { loading: boolean }>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      setAuthState((prev) => ({ ...prev, loading: true }));

      try {
        const response = await fetch(`${API_URL}/auth/verify`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Token invalid");

        const userStr = Cookies.get("user");
        if (!userStr) throw new Error("No user info");

        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token: null,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        console.error("Auth error:", error);
        Cookies.remove("user");
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.LOGIN}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message);
    }

    const formattedUser = {
      id: String(data.data.user.id),
      email: data.data.user.email,
      name: data.data.user.name,
      role: data.data.user.role,
      permissions: [],
    };

    Cookies.set("user", JSON.stringify(formattedUser), {
      expires: 1,
      secure: true,
      sameSite: "strict",
    });

    setAuthState({
      user: formattedUser,
      token: null,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const hasPermission = (permission: Permission) => {
    if (!authState.user) {
      return false;
    }

    const userRole = authState.user.role.key as Role;
    const permissions = RolePermissions[userRole] || [];
    return permissions.includes(permission);
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message);
    }
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        hasPermission,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
