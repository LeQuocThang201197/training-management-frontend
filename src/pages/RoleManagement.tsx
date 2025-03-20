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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  MoreHorizontal,
  Shield,
  Trash2,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { ManageRolePermissionsDialog } from "@/components/dialogs/ManageRolePermissionsDialog";
import { Role } from "@/types/role";
import { RoleFormDialog } from "@/components/dialogs/RoleFormDialog";

export function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/roles`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Lấy dữ liệu vai trò thất bại");

      const data = await response.json();
      setRoles(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDeleteRole = async (roleId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vai trò này?")) return;

    try {
      const response = await fetch(`${API_URL}/auth/roles/${roleId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Xóa vai trò thất bại");

      setRoles(roles.filter((role) => role.id !== roleId));
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Quản lý vai trò</h1>
              <p className="text-sm text-muted-foreground">
                Quản lý vai trò và phân quyền trong hệ thống
              </p>
            </div>
            <Button onClick={() => setFormDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm vai trò
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mô tả..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên vai trò</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Quyền hạn</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {role.permissions.map((p) => (
                          <Badge
                            key={p.permission.name}
                            variant="secondary"
                            className="cursor-help"
                            title={p.permission.description}
                          >
                            {p.permission.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(role.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRole(role);
                                setPermissionDialogOpen(true);
                              }}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Phân quyền
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRole(role);
                                setFormDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa vai trò
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {selectedRole && (
            <ManageRolePermissionsDialog
              role={selectedRole}
              open={permissionDialogOpen}
              onOpenChange={setPermissionDialogOpen}
              onSuccess={() => {
                fetchRoles();
              }}
            />
          )}

          <RoleFormDialog
            role={selectedRole || undefined}
            open={formDialogOpen}
            onOpenChange={(open) => {
              setFormDialogOpen(open);
              if (!open) setSelectedRole(null);
            }}
            onSuccess={fetchRoles}
          />
        </div>
      )}
    </Card>
  );
}
