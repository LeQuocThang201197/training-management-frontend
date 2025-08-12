import { useState, useEffect, useCallback } from "react";
import { API_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ConcentrationFilter } from "@/components/ConcentrationFilter";
import { useConcentrationFilter } from "@/hooks/useConcentrationFilter";
import { ConcentrationFilters } from "@/types/concentrationFilter";
import { Concentration } from "@/types/concentration";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SelectConcentrationCard } from "@/components/cards/ConcentrationCardWrapper";

interface SelectConcentrationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selectedConcentrationIds: number[]) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  excludeIds?: number[]; // IDs của các đợt tập trung đã được chọn trước đó
  maxSelections?: number; // Giới hạn số lượng có thể chọn
  showFilters?: boolean;
  compact?: boolean;
  trigger?: React.ReactNode;
}

/**
 * Dialog component để chọn đợt tập trung với nhiều tính năng:
 * - Lọc đợt tập trung với ConcentrationFilter
 * - Chọn nhiều đợt tập trung
 * - Giới hạn số lượng chọn
 * - Loại trừ các đợt đã chọn trước đó
 *
 * Ví dụ sử dụng:
 *
 * 1. Liên kết với văn bản:
 * <SelectConcentrationsDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onConfirm={handleLinkConcentrations}
 *   title="Liên kết đợt tập trung"
 *   excludeIds={linkedConcentrations.map(c => c.id)}
 * />
 *
 * 2. Chọn đợt tập trung cho giải đấu:
 * <SelectConcentrationsDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onConfirm={handleAddToCompetition}
 *   title="Thêm đợt tập trung vào giải đấu"
 *   maxSelections={10}
 *   showFilters={true}
 * />
 *
 * 3. Chọn đợt tập trung đơn giản:
 * <SelectConcentrationsDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onConfirm={handleSelect}
 *   showFilters={false}
 *   compact={true}
 * />
 */
export function SelectConcentrationsDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Chọn đợt tập trung",
  description = "Chọn các đợt tập trung bạn muốn liên kết",
  confirmText = "Xác nhận",
  excludeIds = [],
  maxSelections,

  showFilters = true,
  compact = false,
  trigger,
}: SelectConcentrationsDialogProps) {
  const [concentrations, setConcentrations] = useState<Concentration[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const {
    filters,
    setFilters,
    sports,
    loadingSports,
    page,
    setPage,
    buildAPIParams,
  } = useConcentrationFilter({
    defaultStatuses: [], // Hiển thị tất cả trạng thái
  });

  const fetchConcentrations = useCallback(async () => {
    try {
      setLoading(true);
      const params = buildAPIParams();
      const response = await fetch(`${API_URL}/concentrations?${params}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách đợt tập trung");
      }

      const data = await response.json();
      if (data.success) {
        // Lọc bỏ các đợt tập trung đã được chọn trước đó
        const filteredConcentrations = data.data.filter(
          (c: Concentration) => !excludeIds.includes(c.id)
        );
        setConcentrations(filteredConcentrations);

        // Cập nhật pagination info
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.totalItems);
        }
      }
    } catch (err) {
      console.error("Fetch concentrations error:", err);
    } finally {
      setLoading(false);
    }
  }, [buildAPIParams, excludeIds]);

  // Fetch concentrations khi dialog mở hoặc filters thay đổi
  useEffect(() => {
    if (open) {
      fetchConcentrations();
    }
  }, [open, page, fetchConcentrations]);

  const handleConcentrationClick = (concentrationId: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(concentrationId)) {
        return prev.filter((id) => id !== concentrationId);
      } else {
        // Kiểm tra giới hạn số lượng chọn
        if (maxSelections && prev.length >= maxSelections) {
          return prev;
        }
        return [...prev, concentrationId];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedIds);
    // Reset selections sau khi submit
    setSelectedIds([]);
    onOpenChange(false);
  };

  const handleFiltersChange = (newFilters: ConcentrationFilters) => {
    setFilters(newFilters);
  };

  // Sử dụng concentrations trực tiếp (không cần filter search)
  const filteredConcentrations = concentrations;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </DialogHeader>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-4">
              <ConcentrationFilter
                filters={filters}
                onFiltersChange={handleFiltersChange}
                sports={sports}
                loadingSports={loadingSports}
                compact={compact}
              />
            </div>
          )}

          {/* Selected Count */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">
                Đã chọn {selectedIds.length} đợt tập trung
                {maxSelections && ` / ${maxSelections}`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds([])}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Bỏ chọn tất cả
              </Button>
            </div>
          )}

          {/* Concentrations List */}
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : filteredConcentrations.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {filteredConcentrations.map((concentration) => {
                  const isSelected = selectedIds.includes(concentration.id);
                  const isDisabled =
                    maxSelections &&
                    selectedIds.length >= maxSelections &&
                    !isSelected;

                  return (
                    <div
                      key={concentration.id}
                      className={cn("rounded-md transition-all")}
                    >
                      <SelectConcentrationCard
                        concentration={concentration}
                        selected={isSelected}
                        disabled={!!isDisabled}
                        onSelect={() =>
                          handleConcentrationClick(concentration.id)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {filters.sportIds.length > 0 ||
                filters.teamTypes.length > 0 ||
                filters.statuses.length > 0 ||
                filters.year
                  ? "Không tìm thấy đợt tập trung nào phù hợp"
                  : "Không có đợt tập trung nào"}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-500">
                Trang {page} / {totalPages} ({totalItems} đợt tập trung)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={selectedIds.length === 0}>
              {confirmText} ({selectedIds.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
