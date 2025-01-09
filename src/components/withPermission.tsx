import { Permission } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: Permission
) {
  return function WithPermissionComponent(props: P) {
    const { hasPermission } = useAuth();

    if (!hasPermission(requiredPermission)) {
      return <Navigate to="/unauthorized" />;
    }

    return <WrappedComponent {...props} />;
  };
}
