import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Role, Permission } from "@/types/role";

interface Props {
  role: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Group permissions by resource for better organization
const groupPermissions = (permissions: Permission[]) => {
  return permissions.reduce((acc, permission) => {
    if (permission.name === "ADMIN") {
      if (!acc["ADMIN"]) acc["ADMIN"] = [];
      acc["ADMIN"].push(permission);
      return acc;
    }

    const resource = permission.name.split("_")[1];
    if (!acc[resource]) acc[resource] = [];
    acc[resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
};

export function ManageRolePermissionsDialog({
  role,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/permissions`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Lấy dữ liệu quyền thất bại");

        const data = await response.json();
        setPermissions(data.data);

        // Set initial selected permissions
        setSelectedPermissions(role.permissions.map((p) => p.permission.id));
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    };

    if (open) {
      fetchPermissions();
    }
  }, [open, role]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/auth/roles/${role.id}/permissions`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissions: selectedPermissions }),
        }
      );

      if (!response.ok) throw new Error("Cập nhật quyền thất bại");

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPermissions = groupPermissions(filteredPermissions);

  const resourceNames: Record<string, string> = {
    ADMIN: "Quản trị hệ thống",
    PERSON: "Quản lý nhân sự",
    CONCENTRATION: "Quản lý tập trung",
    TRAINING: "Quản lý tập huấn",
    COMPETITION: "Quản lý thi đấu",
    PAPER: "Quản lý văn bản",
    TEAM: "Quản lý đội",
    SPORT: "Quản lý môn thể thao",
    ORGANIZATION: "Quản lý đơn vị",
    PERSON_ROLE: "Quản lý vai trò nhân sự",
    ABSENCE: "Quản lý vắng mặt",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Phân quyền cho vai trò: {role.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Tìm kiếm quyền..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([resource, perms]) => (
              <div key={resource} className="space-y-2">
                <h3 className="font-medium">
                  {resourceNames[resource] || resource}
                </h3>
                <div className="grid grid-cols-1 gap-2 pl-2">
                  {perms.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center space-x-3 hover:bg-muted p-2 rounded-md cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={(checked) => {
                          setSelectedPermissions(
                            checked
                              ? [...selectedPermissions, permission.id]
                              : selectedPermissions.filter(
                                  (id) => id !== permission.id
                                )
                          );
                        }}
                      />
                      <div>
                        <p className="font-medium">{permission.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
