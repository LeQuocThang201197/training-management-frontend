import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  ArrowUpDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/config/api";

interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
}

const ITEMS_PER_PAGE = 12; // Số thẻ trên mỗi trang

type SortOption = {
  field: "name" | "usage";
  direction: "asc" | "desc";
  label: string;
};

const sortOptions: SortOption[] = [
  { field: "name", direction: "asc", label: "Tên (A-Z)" },
  { field: "name", direction: "desc", label: "Tên (Z-A)" },
  { field: "usage", direction: "asc", label: "Lượt dùng (Thấp-Cao)" },
  { field: "usage", direction: "desc", label: "Lượt dùng (Cao-Thấp)" },
];

interface TagFormData {
  name: string;
  color: string;
}

const colors = [
  "blue",
  "green",
  "yellow",
  "red",
  "purple",
  "pink",
  "indigo",
  "orange",
  "teal",
  "cyan",
];

export function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TagFormData>({
    name: "",
    color: "bg-blue-100",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return `bg-${colors[randomIndex]}-100`;
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      setFormData({
        name: "",
        color: getRandomColor(),
      });
    }
  };

  // Fetch tags từ API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_URL}/tags`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch tags");

        const data = await response.json();
        setTags(data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
      const response = await fetch(`${API_URL}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create tag");

      const newTag = await response.json();
      setTags((prevTags) => [...prevTags, newTag.data]);
      setIsDialogOpen(false);
      setFormData({ name: "", color: "bg-blue-100" });
    } catch (err) {
      console.error("Error creating tag:", err);
    }
  };

  // Nếu không có tags
  if (tags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-gray-500">Chưa có thẻ nào</p>
        <PermissionGate permission={Permission.CREATE_TAG}>
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm thẻ mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo thẻ mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên thẻ</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nhập tên thẻ..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Màu sắc</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      "blue",
                      "green",
                      "yellow",
                      "red",
                      "purple",
                      "pink",
                      "indigo",
                      "orange",
                      "teal",
                      "cyan",
                    ].map((color) => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded-full bg-${color}-100 cursor-pointer border-2 ${
                          formData.color === `bg-${color}-100`
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            color: `bg-${color}-100`,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">Tạo thẻ</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </PermissionGate>
      </div>
    );
  }

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const totalPages = Math.ceil(filteredTags.length / ITEMS_PER_PAGE);

  const sortedAndPaginatedTags = [...filteredTags]
    .sort((a, b) => {
      const modifier = currentSort.direction === "asc" ? 1 : -1;
      if (currentSort.field === "name") {
        return a.name.localeCompare(b.name) * modifier;
      }
      return (a.usageCount - b.usageCount) * modifier;
    })
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Thẻ</h1>
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
                  Thêm thẻ mới
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo thẻ mới</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên thẻ</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nhập tên thẻ..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Màu sắc</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        "blue",
                        "green",
                        "yellow",
                        "red",
                        "purple",
                        "pink",
                        "indigo",
                        "orange",
                        "teal",
                        "cyan",
                      ].map((color) => (
                        <div
                          key={color}
                          className={`w-8 h-8 rounded-full bg-${color}-100 cursor-pointer border-2 ${
                            formData.color === `bg-${color}-100`
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              color: `bg-${color}-100`,
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button type="submit">Tạo thẻ</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Tìm kiếm thẻ..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAndPaginatedTags.map((tag) => (
          <Card
            key={tag.id}
            className={`${tag.color} hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}
          >
            <div className="p-4 flex items-center justify-between relative">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full bg-${
                    tag.color.split("-")[1]
                  }-500`}
                />
                <span className="font-medium text-lg">{tag.name}</span>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-[-120%]">
                <Badge
                  variant="secondary"
                  className="bg-white/80 backdrop-blur-sm"
                >
                  {tag.usageCount} lượt
                </Badge>
              </div>

              <div className="absolute right-0 top-0 h-full flex items-center opacity-0 transform translate-x-full transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 bg-gradient-to-l from-white/80 via-white/60 to-transparent pr-2">
                <div className="flex items-center space-x-1">
                  <PermissionGate permission={Permission.EDIT_TAG}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-white/60"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                  <PermissionGate permission={Permission.DELETE_TAG}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-white/60"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </div>
              </div>
            </div>
          </Card>
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

          {/* Hiển thị các nút số trang */}
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
    </div>
  );
}
