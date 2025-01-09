import { Permission } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

interface PermissionGateProps {
  permission: Permission;
  children: React.ReactNode;
}

export function PermissionGate({ permission, children }: PermissionGateProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
}
