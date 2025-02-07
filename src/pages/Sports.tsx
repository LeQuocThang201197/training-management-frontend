import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/config/api";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard } from "@/components/HoverCard";

interface Sport {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface SportFormData {
  name: string;
}

const ITEMS_PER_PAGE = 15;

type SortOption = {
  field: "name";
  direction: "asc" | "desc";
  label: string;
};

const sortOptions: SortOption[] = [
  { field: "name", direction: "asc", label: "Tên (A-Z)" },
  { field: "name", direction: "desc", label: "Tên (Z-A)" },
];

// Thêm dữ liệu mẫu
const MOCK_SPORTS: Sport[] = [
  {
    id: 1,
    name: "Aerobic",
    createdAt: "2024-01-16T02:05:23.950Z",
    updatedAt: "2024-01-16T02:05:23.950Z",
  },
  {
    id: 2,
    name: "Bóng đá",
    createdAt: "2024-01-16T02:05:23.950Z",
    updatedAt: "2024-01-16T02:05:23.950Z",
  },
  {
    id: 3,
    name: "Bơi lội",
    createdAt: "2024-01-16T02:05:23.950Z",
    updatedAt: "2024-01-16T02:05:23.950Z",
  },
];

export function SportsPage() {
  const [sports, setSports] = useState<Sport[]>(MOCK_SPORTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<SportFormData>({
    name: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSport, setEditingSport] = useState<Sport | null>(null);
  const [sportToDelete, setSportToDelete] = useState<Sport | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open && !editingSport) {
      setFormData({
        name: "",
      });
    } else if (!open) {
      setEditingSport(null);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchSports = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/sports`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu môn thể thao");
        }

        const data = await response.json();
        if (data.success) {
          setSports(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error("Fetch sports error:", err);
        setError(err instanceof Error ? err.message : "Lỗi khi lấy dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/sports`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.name }),
      });

      if (!response.ok) {
        throw new Error("Không thể tạo môn thể thao");
      }

      const data = await response.json();
      if (data.success) {
        setSports([...sports, data.data]);
        setIsDialogOpen(false);
        setFormData({ name: "" });
      }
    } catch (err) {
      console.error("Create sport error:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi tạo môn thể thao");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSport) return;

    try {
      const response = await fetch(`${API_URL}/sports/${editingSport.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.name }),
      });

      if (!response.ok) {
        throw new Error("Không thể cập nhật môn thể thao");
      }

      const data = await response.json();
      if (data.success) {
        setSports(
          sports.map((sport) =>
            sport.id === editingSport.id ? data.data : sport
          )
        );
        setIsDialogOpen(false);
        setEditingSport(null);
      }
    } catch (err) {
      console.error("Update sport error:", err);
      alert(
        err instanceof Error ? err.message : "Lỗi khi cập nhật môn thể thao"
      );
    }
  };

  const openEditForm = (sport: Sport) => {
    setEditingSport(sport);
    setFormData({
      name: sport.name,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!sportToDelete) return;

    try {
      const response = await fetch(`${API_URL}/sports/${sportToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Không thể xóa môn thể thao");
      }

      setSports(sports.filter((sport) => sport.id !== sportToDelete.id));
      setSportToDelete(null);
    } catch (err) {
      console.error("Delete sport error:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi xóa môn thể thao");
    }
  };

  // Nếu không có sports
  if (sports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-gray-500">Chưa có môn thể thao nào</p>
        <PermissionGate permission={Permission.CREATE_TAG}>
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm môn thể thao
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm môn thể thao mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên môn thể thao</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nhập tên môn thể thao..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Thêm mới
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </PermissionGate>
      </div>
    );
  }

  const filteredSports = sports.filter((sport) =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const totalPages = Math.ceil(filteredSports.length / ITEMS_PER_PAGE);

  const sortedAndPaginatedSports = [...filteredSports]
    .sort((a, b) => {
      const modifier = currentSort.direction === "asc" ? 1 : -1;
      return a.name.localeCompare(b.name) * modifier;
    })
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Môn thể thao</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                {currentSort.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={`${option.field}-${option.direction}`}
                  onClick={() => setCurrentSort(option)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <PermissionGate permission={Permission.CREATE_TAG}>
            <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm môn thể thao
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingSport
                      ? "Chỉnh sửa môn thể thao"
                      : "Thêm môn thể thao mới"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={editingSport ? handleEdit : handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên môn thể thao</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nhập tên môn thể thao..."
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingSport ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Tìm kiếm môn thể thao..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          Hiển thị {sortedAndPaginatedSports.length} / {filteredSports.length}{" "}
          môn thể thao
          {searchTerm ? " (đã lọc)" : ""}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAndPaginatedSports.map((sport) => (
          <HoverCard
            key={sport.id}
            id={sport.id}
            title={sport.name}
            onEdit={() => openEditForm(sport)}
            onDelete={() => setSportToDelete(sport)}
          />
        ))}
      </div>

      {/* Pagination */}
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
        open={!!sportToDelete}
        onOpenChange={(open) => !open && setSportToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Môn thể thao "{sportToDelete?.name}" sẽ bị xóa vĩnh viễn và không
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
