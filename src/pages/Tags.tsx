import { useState } from "react";
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

export function TagsPage() {
  console.log("Rendering TagsPage");

  const [tags] = useState<Tag[]>([
    {
      id: "1",
      name: "Huấn luyện",
      color: "bg-orange-100",
      usageCount: 24,
    },
    {
      id: "2",
      name: "Thi đấu",
      color: "bg-blue-100",
      usageCount: 15,
    },
    {
      id: "3",
      name: "Chính trị",
      color: "bg-green-100",
      usageCount: 18,
    },
    {
      id: "4",
      name: "Thể thao",
      color: "bg-purple-100",
      usageCount: 30,
    },
    {
      id: "5",
      name: "Văn hóa",
      color: "bg-pink-100",
      usageCount: 12,
    },
    {
      id: "6",
      name: "Đào tạo",
      color: "bg-yellow-100",
      usageCount: 22,
    },
    {
      id: "7",
      name: "Giáo dục",
      color: "bg-indigo-100",
      usageCount: 28,
    },
    {
      id: "8",
      name: "Kỹ thuật",
      color: "bg-red-100",
      usageCount: 16,
    },
    {
      id: "9",
      name: "Quân sự",
      color: "bg-teal-100",
      usageCount: 35,
    },
    {
      id: "10",
      name: "Chiến thuật",
      color: "bg-cyan-100",
      usageCount: 20,
    },
    {
      id: "11",
      name: "Chiến lược",
      color: "bg-emerald-100",
      usageCount: 25,
    },
    {
      id: "12",
      name: "Nghiên cứu",
      color: "bg-violet-100",
      usageCount: 14,
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);

  const totalPages = Math.ceil(tags.length / ITEMS_PER_PAGE);

  // Cập nhật logic sắp xếp
  const sortedAndPaginatedTags = [...tags]
    .sort((a, b) => {
      const modifier = currentSort.direction === "asc" ? 1 : -1;
      if (currentSort.field === "name") {
        return a.name.localeCompare(b.name) * modifier;
      }
      return (a.usageCount - b.usageCount) * modifier;
    })
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Xử lý chuyển trang
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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm thẻ mới
            </Button>
          </PermissionGate>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input placeholder="Tìm kiếm thẻ..." className="pl-10" />
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
