import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Permission {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export function PermissionManagementPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/permissions`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Lấy dữ liệu quyền thất bại");

        const data = await response.json();
        setPermissions(data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi lấy dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group permissions by resource (extracted from permission name)
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    // Special case for ADMIN permission
    if (permission.name === "ADMIN") {
      if (!acc["ADMIN"]) {
        acc["ADMIN"] = [];
      }
      acc["ADMIN"].push(permission);
      return acc;
    }

    // For other permissions, extract resource name
    const resource = permission.name.split("_")[1];
    if (!acc[resource]) {
      acc[resource] = [];
    }
    acc[resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Map of resource names to display names
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
    <Card>
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[400px] text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Danh sách quyền hệ thống</h1>
            <p className="text-sm text-muted-foreground">
              Xem tất cả các quyền được định nghĩa trong hệ thống
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Tìm kiếm quyền..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([resource, perms]) => (
              <div key={resource} className="rounded-md border">
                <div className="bg-muted px-4 py-2 border-b">
                  <h3 className="font-medium">
                    {resourceNames[resource] || resource}
                  </h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên quyền</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Mã quyền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perms.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">
                          {permission.name}
                        </TableCell>
                        <TableCell>{permission.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {permission.name.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
