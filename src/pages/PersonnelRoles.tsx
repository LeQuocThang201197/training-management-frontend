import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { HoverCard } from "@/components/HoverCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface PersonRole {
  id: number;
  name: string; // Tên vai trò
  type: string; // Phân loại
  typeLabel: string; // Phân loại
  createdAt: string;
  updatedAt: string;
}

interface RoleType {
  value: string;
  label: string;
}

export function PersonnelRolesPage() {
  const [roles, setRoles] = useState<PersonRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });
  const [roleTypes, setRoleTypes] = useState<RoleType[]>([]);
  const [roleToDelete, setRoleToDelete] = useState<PersonRole | null>(null);
  const [editingRole, setEditingRole] = useState<PersonRole | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_URL}/person-roles`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách vai trò");

        const data = await response.json();
        if (data.success) {
          setRoles(data.data);
        }
      } catch (err) {
        console.error("Fetch roles error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchRoleTypes = async () => {
      try {
        const response = await fetch(`${API_URL}/person-roles/types`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách phân loại");

        const data = await response.json();
        if (data.success) {
          setRoleTypes(data.data);
        }
      } catch (err) {
        console.error("Fetch role types error:", err);
      }
    };

    fetchRoleTypes();
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/person-roles`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Không thể thêm vai trò");

      const data = await response.json();
      if (data.success) {
        setRoles((prev) => [...prev, data.data]);
        setIsDialogOpen(false);
        setFormData({ name: "", type: "" });
      }
    } catch (err) {
      console.error("Add role error:", err);
      alert("Có lỗi xảy ra khi thêm vai trò");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    try {
      const response = await fetch(
        `${API_URL}/person-roles/${editingRole.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Không thể cập nhật vai trò");

      const data = await response.json();
      if (data.success) {
        setRoles((prev) =>
          prev.map((role) => (role.id === editingRole.id ? data.data : role))
        );
        setIsDialogOpen(false);
        setEditingRole(null);
      }
    } catch (err) {
      console.error("Update role error:", err);
      alert("Có lỗi xảy ra khi cập nhật vai trò");
    }
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/person-roles/${roleToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể xóa vai trò");

      setRoles((prev) => prev.filter((role) => role.id !== roleToDelete.id));
      setRoleToDelete(null);
    } catch (err) {
      console.error("Delete role error:", err);
      alert("Có lỗi xảy ra khi xóa vai trò");
    }
  };

  const openEditForm = (role: PersonRole) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      type: role.type,
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Vai trò</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingRole(null);
              setFormData({ name: "", type: "" });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm vai trò
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRole ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={editingRole ? handleEdit : handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Tên vai trò</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nhập tên vai trò"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Phân loại</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phân loại" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {editingRole ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Tìm kiếm vai trò..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => (
          <HoverCard
            key={role.id}
            id={role.id}
            title={role.name}
            subtitle={role.typeLabel}
            onEdit={() => openEditForm(role)}
            onDelete={() => setRoleToDelete(role)}
          ></HoverCard>
        ))}
      </div>

      <AlertDialog
        open={!!roleToDelete}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Vai trò "{roleToDelete?.name}" sẽ bị xóa vĩnh viễn và không thể
              khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-4">
            <AlertDialogCancel className="w-full sm:w-32 bg-gray-100 hover:bg-gray-200 border-none text-gray-900">
              Không
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full sm:w-32 bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Có, xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
