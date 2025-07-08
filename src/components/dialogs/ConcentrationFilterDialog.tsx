import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConcentrationFilter } from "@/components/ConcentrationFilter";
import { ConcentrationFilters, Sport } from "@/types/concentrationFilter";
import { Filter, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface ConcentrationFilterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ConcentrationFilters;
  onFiltersChange: (filters: ConcentrationFilters) => void;
  sports: Sport[];
  loadingSports?: boolean;
  onResetFilters?: () => void;
}

export function ConcentrationFilterDialog({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange,
  sports,
  loadingSports = false,
  onResetFilters,
}: ConcentrationFilterDialogProps) {
  const [tempFilters, setTempFilters] = useState<ConcentrationFilters>(filters);

  // Sync tempFilters with filters when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTempFilters(filters);
    }
  }, [isOpen, filters]);

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    onResetFilters?.();
    setTempFilters(filters);
  };

  const handleCancel = () => {
    setTempFilters(filters);
    onOpenChange(false);
  };

  // Đếm số filter đang active
  const getActiveFilterCount = () => {
    let count = 0;
    if (tempFilters.sportIds.length > 0) count++;
    if (tempFilters.teamTypes.length > 0) count++;
    if (tempFilters.statuses.length > 0) count++;
    if (tempFilters.year !== new Date().getFullYear().toString()) count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc đợt tập trung
          </DialogTitle>
          <DialogDescription>
            Chọn các tiêu chí để lọc danh sách đợt tập trung
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <ConcentrationFilter
            filters={tempFilters}
            onFiltersChange={setTempFilters}
            sports={sports}
            loadingSports={loadingSports}
            compact={false}
          />
        </div>

        <DialogFooter className="flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              {getActiveFilterCount() > 0 && (
                <span className="text-sm text-gray-600">
                  {getActiveFilterCount()} bộ lọc đang áp dụng
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button onClick={handleApply}>Áp dụng bộ lọc</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
