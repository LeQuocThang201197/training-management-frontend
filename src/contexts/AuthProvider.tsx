import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { AuthState } from "../types/auth";
import { API_URL, API_ENDPOINTS } from "../config/api";
import { Permission, Role, RolePermissions } from "../types/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState & { loading: boolean }>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.LOGIN}`, {
      method: "POST",
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
      fullName: data.data.user.name,
      role: data.data.user.role,
      permissions: [],
    };

    console.log("Saving to localStorage:", {
      token: data.data.token,
      user: formattedUser,
    });

    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(formattedUser));

    // Kiểm tra ngay sau khi lưu
    console.log("Verify localStorage:", {
      token: localStorage.getItem("token"),
      user: JSON.parse(localStorage.getItem("user") || "{}"),
    });

    setAuthState({
      user: formattedUser,
      token: data.data.token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const hasPermission = (permission: Permission) => {
    if (!authState.user) {
      console.log("No user found");
      return false;
    }

    const userRole = authState.user.role.key as Role;
    console.log("User role:", userRole);
    console.log("Available permissions:", RolePermissions[userRole]);

    const permissions = RolePermissions[userRole] || [];
    const hasPermission = permissions.includes(permission);

    console.log("Checking permission:", permission);
    console.log("Has permission:", hasPermission);

    return hasPermission;
  };

  const register = async (userData: {
    fullName: string;
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
