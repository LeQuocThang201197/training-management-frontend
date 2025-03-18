import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const hasPermission = (permission: string) => {
    if (!context.user) return false;
    if (context.user.permissions.includes("ADMIN")) return true;
    return context.user.permissions.includes(permission);
  };

  const hasRole = (requiredRole: string) => {
    return context.user?.roles.includes(requiredRole) ?? false;
  };

  return {
    ...context,
    hasPermission,
    hasRole,
  };
};
