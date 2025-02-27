import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";
import { Input } from "@/components/ui/input";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { HoverCard } from "@/components/cards/HoverCard";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Organization {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [organizationToDelete, setOrganizationToDelete] =
    useState<Organization | null>(null);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${API_URL}/organizations`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách đơn vị");

        const data = await response.json();
        if (data.success) {
          setOrganizations(data.data);
        }
      } catch (err) {
        console.error("Fetch organizations error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredOrganizations = organizations.filter((organization) =>
    organization.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const totalPages = Math.ceil(filteredOrganizations.length / ITEMS_PER_PAGE);
  const paginatedOrganizations = filteredOrganizations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/organizations`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Không thể thêm đơn vị");

      const data = await response.json();
      if (data.success) {
        setOrganizations((prev) => [...prev, data.data]);
        setIsDialogOpen(false);
        setFormData({ name: "" });
      }
    } catch (err) {
      console.error("Add organization error:", err);
      alert("Có lỗi xảy ra khi thêm đơn vị");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrganization) return;

    try {
      const response = await fetch(
        `${API_URL}/organizations/${editingOrganization.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Không thể cập nhật đơn vị");

      const data = await response.json();
      if (data.success) {
        setOrganizations((prev) =>
          prev.map((org) =>
            org.id === editingOrganization.id ? data.data : org
          )
        );
        setIsDialogOpen(false);
        setEditingOrganization(null);
      }
    } catch (err) {
      console.error("Update organization error:", err);
      alert("Có lỗi xảy ra khi cập nhật đơn vị");
    }
  };

  const handleDelete = async () => {
    if (!organizationToDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/organizations/${organizationToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể xóa đơn vị");

      setOrganizations((prev) =>
        prev.filter((org) => org.id !== organizationToDelete.id)
      );
      setOrganizationToDelete(null);
    } catch (err) {
      console.error("Delete organization error:", err);
      alert("Có lỗi xảy ra khi xóa đơn vị");
    }
  };

  const openEditForm = (organization: Organization) => {
    setEditingOrganization(organization);
    setFormData({
      name: organization.name,
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
        <h1 className="text-2xl font-bold">Danh mục đơn vị</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingOrganization(null);
              setFormData({ name: "" });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm đơn vị
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOrganization ? "Chỉnh sửa đơn vị" : "Thêm đơn vị mới"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={editingOrganization ? handleEdit : handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Tên đơn vị</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nhập tên đơn vị"
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
                <Button type="submit">
                  {editingOrganization ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Tìm kiếm đơn vị..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedOrganizations.map((organization) => (
          <HoverCard
            key={organization.id}
            id={organization.id}
            title={organization.name}
            onEdit={() => openEditForm(organization)}
            onDelete={() => setOrganizationToDelete(organization)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
              className="w-8 h-8"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AlertDialog
        open={!!organizationToDelete}
        onOpenChange={(open) => !open && setOrganizationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Đơn vị "{organizationToDelete?.name}" sẽ bị xóa vĩnh viễn và không
              thể khôi phục.
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
