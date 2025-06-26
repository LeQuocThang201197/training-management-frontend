import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Trophy,
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

import { CompetitionCard } from "@/components/cards/CompetitionCard";
import { Competition } from "@/types/competition";
import { PermissionGate } from "@/components/PermissionGate";
import { CompetitionDialog } from "@/components/dialogs/CompetitionDialog";

const ITEMS_PER_PAGE = 9;

type SortOption = {
  field: "name" | "startDate" | "location" | "endDate" | "createdAt";
  direction: "asc" | "desc";
  label: string;
};

const sortOptions: SortOption[] = [
  { field: "name", direction: "asc", label: "Tên (A-Z)" },
  { field: "name", direction: "desc", label: "Tên (Z-A)" },
  { field: "startDate", direction: "desc", label: "Ngày bắt đầu (Mới nhất)" },
  { field: "startDate", direction: "asc", label: "Ngày bắt đầu (Cũ nhất)" },
  { field: "location", direction: "asc", label: "Địa điểm (A-Z)" },
  { field: "location", direction: "desc", label: "Địa điểm (Z-A)" },
];

interface CompetitionsResponse {
  success: boolean;
  data: Competition[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CompetitionStats {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
}

interface StatsResponse {
  success: boolean;
  data: CompetitionStats;
}

export function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [stats, setStats] = useState<CompetitionStats>({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[2]); // startDate desc
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] =
    useState<Competition | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>(["ongoing"]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [confirmedFilter, setConfirmedFilter] = useState<boolean | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });

  const statusOptions = [
    { value: "ongoing", label: "Đang diễn ra" },
    { value: "upcoming", label: "Sắp diễn ra" },
    { value: "completed", label: "Đã kết thúc" },
  ];

  const typeOptions = [
    { value: "domestic", label: "Trong nước" },
    { value: "foreign", label: "Quốc tế" },
  ];

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch(`${API_URL}/competitions/stats`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể tải thống kê");

      const data: StatsResponse = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchCompetitions = useCallback(async () => {
    try {
      setLoading(true);

      const buildApiUrl = () => {
        const params = new URLSearchParams();

        // Pagination
        params.append("page", currentPage.toString());
        params.append("limit", ITEMS_PER_PAGE.toString());

        // Search
        if (searchTerm.trim()) {
          params.append("search", searchTerm.trim());
        }

        // Sort
        params.append("sortBy", currentSort.field);
        params.append("sortOrder", currentSort.direction);

        // Type filter (isForeign)
        if (typeFilters.length === 1) {
          if (typeFilters.includes("foreign")) {
            params.append("isForeign", "true");
          } else if (typeFilters.includes("domestic")) {
            params.append("isForeign", "false");
          }
        }

        // Confirmed filter
        if (confirmedFilter !== null) {
          params.append("is_confirmed", confirmedFilter.toString());
        }

        return `${API_URL}/competitions?${params.toString()}`;
      };

      const url = buildApiUrl();
      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Không thể tải danh sách thi đấu");

      const data: CompetitionsResponse = await response.json();
      if (data.success) {
        setCompetitions(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentSort, searchTerm, typeFilters, confirmedFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilters, typeFilters, confirmedFilter]);

  const handleFilterChange = {
    status: (value: string) => {
      setStatusFilters((prev) =>
        prev.includes(value)
          ? prev.filter((status) => status !== value)
          : [...prev, value]
      );
    },
    type: (value: string) => {
      setTypeFilters((prev) =>
        prev.includes(value)
          ? prev.filter((type) => type !== value)
          : [...prev, value]
      );
    },
    confirmed: (value: boolean | null) => {
      setConfirmedFilter(value);
    },
    search: (value: string) => {
      setSearchTerm(value);
    },
    sort: (option: SortOption) => {
      setCurrentSort(option);
    },
  };

  const handleEdit = (competition: Competition) => {
    setEditingCompetition(competition);
    setIsDialogOpen(true);
  };

  const handleDelete = async (competition: Competition) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thi đấu này?")) return;

    try {
      const response = await fetch(
        `${API_URL}/competitions/${competition.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Không thể xóa thi đấu");

      const data = await response.json();
      if (data.success) {
        fetchCompetitions();
        fetchStats(); // Refresh stats after delete
      }
    } catch (err) {
      console.error("Delete competition error:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi xóa thi đấu");
    }
  };

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

  // Client-side filtering for status (since API doesn't support it)
  const filteredCompetitions = competitions.filter((competition) => {
    const today = new Date();
    const startDate = new Date(competition.startDate);
    const endDate = new Date(competition.endDate);
    endDate.setHours(23, 59, 59, 999);

    const status =
      today < startDate
        ? "upcoming"
        : today > endDate
        ? "completed"
        : "ongoing";

    const matchesStatus =
      statusFilters.length === 0 || statusFilters.includes(status);

    return matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Thi đấu</h1>
        <div className="flex gap-2">
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
                  onClick={() => handleFilterChange.status(option.value)}
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
                <Trophy className="h-4 w-4" />
                {typeFilters.length === 0
                  ? "Tất cả loại"
                  : `${typeFilters.length} loại`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {typeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleFilterChange.type(option.value)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox checked={typeFilters.includes(option.value)} />
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
                  onClick={() => handleFilterChange.sort(option)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <PermissionGate permission="CREATE_COMPETITION">
            <Button
              onClick={() => {
                setEditingCompetition(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm thi đấu
            </Button>
          </PermissionGate>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Tìm kiếm thi đấu..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => handleFilterChange.search(e.target.value)}
          clearable
        />
      </div>

      {/* Thông tin tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Tổng số thi đấu
              </p>
              <p className="text-2xl font-bold text-blue-800">
                {statsLoading ? (
                  <div className="animate-pulse bg-blue-200 h-8 w-12 rounded"></div>
                ) : (
                  stats.total
                )}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Đang diễn ra</p>
              <p className="text-2xl font-bold text-green-800">
                {statsLoading ? (
                  <div className="animate-pulse bg-green-200 h-8 w-12 rounded"></div>
                ) : (
                  stats.ongoing
                )}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Sắp diễn ra</p>
              <p className="text-2xl font-bold text-orange-800">
                {statsLoading ? (
                  <div className="animate-pulse bg-orange-200 h-8 w-12 rounded"></div>
                ) : (
                  stats.upcoming
                )}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Đã kết thúc</p>
              <p className="text-2xl font-bold text-gray-800">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                ) : (
                  stats.completed
                )}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {filteredCompetitions.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy thi đấu nào
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilters.length > 0 || typeFilters.length > 0
              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              : "Chưa có thi đấu nào được tạo"}
          </p>
          {!searchTerm &&
            statusFilters.length === 0 &&
            typeFilters.length === 0 && (
              <PermissionGate permission="CREATE_COMPETITION">
                <Button
                  onClick={() => {
                    setEditingCompetition(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm thi đấu đầu tiên
                </Button>
              </PermissionGate>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompetitions.map((competition) => (
            <CompetitionCard
              key={competition.id}
              competition={competition}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8"
              >
                {page}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <CompetitionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        competition={editingCompetition || undefined}
        onSubmit={async (formData) => {
          try {
            const url = editingCompetition
              ? `${API_URL}/competitions/${editingCompetition.id}`
              : `${API_URL}/competitions`;

            const response = await fetch(url, {
              method: editingCompetition ? "PUT" : "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });

            if (!response.ok) {
              throw new Error(
                editingCompetition
                  ? "Không thể cập nhật thi đấu"
                  : "Không thể tạo thi đấu"
              );
            }

            const data = await response.json();
            if (data.success) {
              fetchCompetitions();
              fetchStats(); // Refresh stats after create/update
              setIsDialogOpen(false);
              setEditingCompetition(null);
            }
          } catch (err) {
            console.error("Competition submit error:", err);
            alert(err instanceof Error ? err.message : "Lỗi khi xử lý thi đấu");
          }
        }}
      />
    </div>
  );
}
