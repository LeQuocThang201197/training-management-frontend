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
import { Role } from "@/types/role";
import { User } from "@/types/auth";

interface Props {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ManageUserRolesDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/roles`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Lấy dữ liệu vai trò thất bại");

        const data = await response.json();
        setRoles(data.data);

        // Set initial selected roles
        setSelectedRoles(user.roles.map((r) => r.role.id));
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    if (open) {
      fetchRoles();
    }
  }, [open, user]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/users/${user.id}/roles`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles: selectedRoles }),
      });

      if (!response.ok) throw new Error("Cập nhật vai trò thất bại");

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phân vai trò cho: {user.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Tìm kiếm vai trò..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            {filteredRoles.map((role) => (
              <label
                key={role.id}
                className="flex items-center space-x-3 hover:bg-muted p-2 rounded-md cursor-pointer"
              >
                <Checkbox
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={(checked) => {
                    setSelectedRoles(
                      checked
                        ? [...selectedRoles, role.id]
                        : selectedRoles.filter((id) => id !== role.id)
                    );
                  }}
                />
                <div>
                  <p className="font-medium">{role.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </label>
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
