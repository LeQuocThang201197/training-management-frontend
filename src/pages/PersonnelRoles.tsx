import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Personnel {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function PersonnelRolesPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const response = await fetch(`${API_URL}/personnel`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách nhân sự");

        const data = await response.json();
        if (data.success) {
          setPersonnel(data.data);
        }
      } catch (err) {
        console.error("Fetch personnel error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, []);

  const handleRoleChange = async (personnelId: number, newRole: string) => {
    try {
      const response = await fetch(`${API_URL}/personnel/${personnelId}/role`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Không thể cập nhật vai trò");

      const data = await response.json();
      if (data.success) {
        setPersonnel((prev) =>
          prev.map((p) => (p.id === personnelId ? { ...p, role: newRole } : p))
        );
      }
    } catch (err) {
      console.error("Update role error:", err);
      alert("Có lỗi xảy ra khi cập nhật vai trò");
    }
  };

  const filteredPersonnel = personnel.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

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
        <h1 className="text-2xl font-bold">Quản lý Vai trò Nhân sự</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Tìm kiếm nhân sự..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPersonnel.map((person) => (
            <TableRow key={person.id}>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell>
                <Select
                  value={person.role}
                  onValueChange={(value) => handleRoleChange(person.id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Quản lý</SelectItem>
                    <SelectItem value="USER">Người dùng</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
