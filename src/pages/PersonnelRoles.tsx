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

interface PersonRole {
  id: number;
  name: string; // Tên vai trò
  type: string; // Phân loại
  createdAt: string;
  updatedAt: string;
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm vai trò
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm vai trò mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  placeholder="Nhập phân loại"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Thêm mới</Button>
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
            description={`Phân loại: ${role.type}\nNgày tạo: ${new Date(
              role.createdAt
            ).toLocaleDateString("vi-VN")}\nCập nhật: ${new Date(
              role.updatedAt
            ).toLocaleDateString("vi-VN")}`}
          >
            <div className="p-4 border rounded-lg hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
              <h3 className="font-medium text-lg mb-1">{role.name}</h3>
              <p className="text-sm text-gray-500">{role.type}</p>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
