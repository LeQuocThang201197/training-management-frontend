import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
} from "lucide-react";
import { API_URL } from "@/config/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { ConcentrationCard } from "@/components/cards/ConcentrationCard";
import { Concentration } from "@/types/concentration";
import { PermissionGate } from "@/components/PermissionGate";
import { ConcentrationDialog } from "@/components/dialogs/ConcentrationDialog";

const ITEMS_PER_PAGE = 21;

type SortOption = {
  field: "name" | "date";
  direction: "asc" | "desc";
  label: string;
};

const sortOptions: SortOption[] = [
  { field: "name", direction: "asc", label: "Tên (A-Z)" },
  { field: "name", direction: "desc", label: "Tên (Z-A)" },
  { field: "date", direction: "desc", label: "Ngày bắt đầu (Mới nhất)" },
  { field: "date", direction: "asc", label: "Ngày bắt đầu (Cũ nhất)" },
];

export function ConcentrationPage() {
  const [concentrations, setConcentrations] = useState<Concentration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamTypeFilters, setTeamTypeFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>(["ongoing"]);

  const filterOptions = [
    { value: "Tuyển", label: "Đội tuyển" },
    { value: "Trẻ", label: "Đội trẻ" },
    { value: "Người khuyết tật", label: "Đội người khuyết tật" },
  ];

  const statusOptions = [
    { value: "ongoing", label: "Đang diễn ra" },
    { value: "upcoming", label: "Sắp diễn ra" },
    { value: "completed", label: "Đã kết thúc" },
  ];

  const fetchConcentrations = async () => {
    try {
      const response = await fetch(`${API_URL}/concentrations`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Không thể tải danh sách tập trung");

      const data = await response.json();
      if (data.success) {
        setConcentrations(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcentrations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  const filteredConcentrations = concentrations.filter((concentration) => {
    const matchesSearch = concentration.team.sport
      ? concentration.team.sport
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim())
      : false;

    const matchesType =
      teamTypeFilters.length === 0 ||
      teamTypeFilters.includes(concentration.team.type);

    const today = new Date();
    const startDate = new Date(concentration.startDate);
    const endDate = new Date(concentration.endDate);

    const status =
      today < startDate
        ? "upcoming"
        : today > endDate
        ? "completed"
        : "ongoing";

    const matchesStatus =
      statusFilters.length === 0 || statusFilters.includes(status);

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredConcentrations.length / ITEMS_PER_PAGE);

  const sortedAndPaginatedConcentrations = [...filteredConcentrations]
    .sort((a, b) => {
      const modifier = currentSort.direction === "asc" ? 1 : -1;
      if (currentSort.field === "date") {
        return (
          (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) *
          modifier
        );
      }
      return a.team.sport.localeCompare(b.team.sport) * modifier;
    })
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Tập trung</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {teamTypeFilters.length === 0
                  ? "Tất cả các đội"
                  : `${teamTypeFilters.length} loại đội`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => {
                    setTeamTypeFilters((prev) =>
                      prev.includes(option.value)
                        ? prev.filter((type) => type !== option.value)
                        : [...prev, option.value]
                    );
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={teamTypeFilters.includes(option.value)}
                    />
                    {option.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {statusFilters.length === 0
                  ? "Tất cả trạng thái"
                  : `${statusFilters.length} trạng thái`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => {
                    setStatusFilters((prev) =>
                      prev.includes(option.value)
                        ? prev.filter((status) => status !== option.value)
                        : [...prev, option.value]
                    );
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox checked={statusFilters.includes(option.value)} />
                    {option.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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

          <PermissionGate permission="CREATE_CONCENTRATION">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm đợt tập trung
            </Button>
          </PermissionGate>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Tìm kiếm đợt tập trung..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAndPaginatedConcentrations.map((concentration) => (
          <ConcentrationCard
            key={concentration.id}
            concentration={concentration}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(page)}
              className="w-8 h-8"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ConcentrationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={async (formData) => {
          try {
            const response = await fetch(`${API_URL}/concentrations`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Không thể tạo đợt tập trung");

            const data = await response.json();
            if (data.success) {
              fetchConcentrations();
              setIsDialogOpen(false);
            }
          } catch (err) {
            console.error("Create concentration error:", err);
            alert(
              err instanceof Error ? err.message : "Lỗi khi tạo đợt tập trung"
            );
          }
        }}
        mode="create"
      />
    </div>
  );
}
