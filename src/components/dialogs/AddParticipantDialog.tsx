import { useState, useEffect, useCallback } from "react";
import { API_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Person {
  id: number;
  name: string;
  code: string;
}

interface Role {
  id: number;
  name: string;
  type: string;
  typeLabel: string;
}

interface Organization {
  id: number;
  name: string;
}

interface AddParticipantDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  concentrationStartDate: string;
  concentrationEndDate: string;
  onSubmit: (data: {
    personId: string;
    roleId: string;
    organizationId: string;
    startDate: string;
    endDate: string;
    note: string;
  }) => void;
}

export function AddParticipantDialog({
  isOpen,
  onOpenChange,
  concentrationStartDate,
  concentrationEndDate,
  onSubmit,
}: AddParticipantDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    personId: "",
    roleId: "",
    organizationId: "",
    startDate: concentrationStartDate,
    endDate: concentrationEndDate,
    note: "",
  });

  // Thêm state cho tìm kiếm đơn vị
  const [organizationSearchTerm, setOrganizationSearchTerm] = useState("");
  const [isOrganizationDropdownOpen, setIsOrganizationDropdownOpen] =
    useState(false);

  // Thêm hàm lọc đơn vị
  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(organizationSearchTerm.toLowerCase().trim())
  );

  // Fetch roles
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
      }
    };

    fetchRoles();
  }, []);

  // Fetch organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${API_URL}/organizations/all`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách đơn vị");

        const data = await response.json();
        if (data.success) {
          setOrganizations(data.data);
        }
      } catch (err) {
        console.error("Fetch organizations error:", err);
      }
    };

    fetchOrganizations();
  }, []);

  // Search people
  useEffect(() => {
    const searchPeople = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/persons/search?q=${encodeURIComponent(searchTerm)}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Không thể tìm kiếm");

        const data = await response.json();
        if (data.success) {
          setSearchResults(data.data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPeople, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Chuyển resetForm thành useCallback để tránh re-render không cần thiết
  const resetForm = useCallback(() => {
    setFormData({
      personId: "",
      roleId: "",
      organizationId: "",
      startDate: concentrationStartDate,
      endDate: concentrationEndDate,
      note: "",
    });
    setSearchTerm("");
    setOrganizationSearchTerm("");
  }, [concentrationStartDate, concentrationEndDate]);

  // Cập nhật dependency array
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Cập nhật hàm handleSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    resetForm(); // Reset form sau khi submit
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm thành viên</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tìm kiếm người */}
          <div className="space-y-2">
            <Label>Tìm kiếm người</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                className="pl-10"
                placeholder="Nhập tên hoặc mã số để tìm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {loading && (
              <div className="text-sm text-gray-500">Đang tìm kiếm...</div>
            )}
            {searchResults.length > 0 && (
              <div className="border rounded-md max-h-40 overflow-y-auto">
                {searchResults.map((person) => (
                  <div
                    key={person.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        personId: person.id.toString(),
                      }));
                      setSearchTerm(person.name);
                      setSearchResults([]);
                    }}
                  >
                    <div className="font-medium">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.code}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chọn vai trò */}
          <div className="space-y-2">
            <Label>Vai trò</Label>
            <Select
              value={formData.roleId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, roleId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chọn đơn vị */}
          <div className="space-y-2">
            <Label>Đơn vị</Label>
            <div className="relative">
              <Input
                placeholder="Tìm kiếm đơn vị..."
                value={organizationSearchTerm}
                onChange={(e) => {
                  setOrganizationSearchTerm(e.target.value);
                  setIsOrganizationDropdownOpen(true);
                }}
                onClick={() => setIsOrganizationDropdownOpen(true)}
              />
              {isOrganizationDropdownOpen &&
                filteredOrganizations.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                    {filteredOrganizations.map((org) => (
                      <div
                        key={org.id}
                        className={cn(
                          "px-3 py-2 cursor-pointer hover:bg-gray-100",
                          formData.organizationId === org.id.toString() &&
                            "bg-gray-100"
                        )}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            organizationId: org.id.toString(),
                          }));
                          setOrganizationSearchTerm(org.name);
                          setIsOrganizationDropdownOpen(false);
                        }}
                      >
                        {org.name}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* Ngày bắt đầu */}
          <div className="space-y-2">
            <Label>Ngày bắt đầu</Label>
            <Input
              type="date"
              value={format(new Date(formData.startDate), "yyyy-MM-dd")}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </div>

          {/* Ngày kết thúc */}
          <div className="space-y-2">
            <Label>Ngày kết thúc</Label>
            <Input
              type="date"
              value={format(new Date(formData.endDate), "yyyy-MM-dd")}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>

          {/* Ghi chú */}
          <div className="space-y-2">
            <Label>Ghi chú</Label>
            <Textarea
              value={formData.note}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, note: e.target.value }))
              }
              placeholder="Nhập ghi chú (nếu có)..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">Thêm</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
