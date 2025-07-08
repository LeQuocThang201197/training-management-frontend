import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "@/config/api";

import { ConcentrationCard } from "@/components/cards/ConcentrationCard";
import { Concentration } from "@/types/concentration";
import { PermissionGate } from "@/components/PermissionGate";
import { ConcentrationDialog } from "@/components/dialogs/ConcentrationDialog";
import { useConcentrationFilter } from "@/hooks/useConcentrationFilter";
import { ConcentrationFilter } from "@/components/ConcentrationFilter";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ConcentrationPage() {
  const [concentrations, setConcentrations] = useState<Concentration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  // Use concentration filter hook
  const {
    filters,
    setFilters,
    sports,
    loadingSports,
    page,
    setPage,
    resetFilters,
  } = useConcentrationFilter({
    defaultStatuses: ["active"], // Default to active instead of ongoing
  });

  useEffect(() => {
    const fetchConcentrations = async () => {
      try {
        setLoading(true);

        // Build API parameters directly
        const params = new URLSearchParams();
        if (filters.sportIds.length > 0) {
          params.append("sportId", filters.sportIds.join(","));
        }
        if (filters.teamTypes.length > 0) {
          params.append("teamType", filters.teamTypes.join(","));
        }
        if (filters.statuses.length > 0) {
          params.append("status", filters.statuses.join(","));
        }
        if (filters.year) {
          params.append("year", filters.year);
        }
        params.append("sortBy", filters.sortBy);
        params.append("sortOrder", filters.sortOrder);
        params.append("page", page.toString());
        params.append("limit", "12");

        const response = await fetch(`${API_URL}/concentrations?${params}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách tập trung");

        const data = await response.json();
        if (data.success) {
          setConcentrations(data.data);
          setPagination({
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchConcentrations();
  }, [filters, page]); // Loại bỏ buildAPIParams khỏi dependency

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

  const displayedConcentrations = concentrations;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Tập trung</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {(filters.sportIds.length > 0 ||
              filters.teamTypes.length > 0 ||
              filters.statuses.length > 0 ||
              filters.year !== new Date().getFullYear().toString()) && (
              <Badge variant="secondary" className="ml-1">
                {[
                  filters.sportIds.length > 0 && filters.sportIds.length,
                  filters.teamTypes.length > 0 && filters.teamTypes.length,
                  filters.statuses.length > 0 && filters.statuses.length,
                  filters.year !== new Date().getFullYear().toString() && 1,
                ]
                  .filter(Boolean)
                  .reduce((a, b) => Number(a) + Number(b), 0)}
              </Badge>
            )}
          </Button>
          <PermissionGate permission="CREATE_CONCENTRATION">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm đợt tập trung
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="mb-6">
          <ConcentrationFilter
            filters={filters}
            onFiltersChange={setFilters}
            sports={sports}
            loadingSports={loadingSports}
            compact
          />
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.sportIds.length > 0 ||
        filters.teamTypes.length > 0 ||
        filters.statuses.length > 0 ||
        filters.year !== new Date().getFullYear().toString()) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.sportIds.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              Môn thể thao: {filters.sportIds.length}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, sportIds: [] }))
                }
              />
            </Badge>
          )}
          {filters.teamTypes.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              Loại đội: {filters.teamTypes.length}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, teamTypes: [] }))
                }
              />
            </Badge>
          )}
          {filters.statuses.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              Trạng thái: {filters.statuses.length}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, statuses: [] }))
                }
              />
            </Badge>
          )}
          {filters.year !== new Date().getFullYear().toString() && (
            <Badge variant="outline" className="flex items-center gap-1">
              Năm: {filters.year}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    year: new Date().getFullYear().toString(),
                  }))
                }
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs"
          >
            Xóa tất cả
          </Button>
        </div>
      )}

      {/* Results info */}
      <div className="mb-4 text-sm text-gray-600">
        Hiển thị {displayedConcentrations.length} / {pagination.total} đợt tập
        trung
      </div>

      {/* Concentrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedConcentrations.map((concentration) => (
          <ConcentrationCard
            key={concentration.id}
            concentration={concentration}
          />
        ))}
      </div>

      {/* No results message */}
      {displayedConcentrations.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Không tìm thấy đợt tập trung nào</p>
          <p className="text-sm mt-2">
            Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="icon"
                onClick={() => setPage(pageNum)}
                className="w-8 h-8"
              >
                {pageNum}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
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
              // Trigger re-fetch by updating a dependency
              setFilters((prev) => ({ ...prev }));
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
