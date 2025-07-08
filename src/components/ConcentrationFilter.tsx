import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, ArrowUpDown } from "lucide-react";
import {
  ConcentrationFilterProps,
  Sport,
  TEAM_TYPES,
  STATUS_OPTIONS,
  SORT_OPTIONS,
} from "@/types/concentrationFilter";
import { cn } from "@/lib/utils";

interface ConcentrationFilterComponentProps extends ConcentrationFilterProps {
  sports: Sport[];
  loadingSports?: boolean;
}

export function ConcentrationFilter({
  filters,
  onFiltersChange,
  sports,
  loadingSports = false,
  showSports = true,
  showSort = true,
  compact = false,
  className,
}: ConcentrationFilterComponentProps) {
  const updateFilters = (updates: Partial<typeof filters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">Bộ lọc:</span>
      </div>

      <div
        className={cn(
          "grid gap-3",
          compact
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
        )}
      >
        {/* Sport Filter */}
        {showSports && (
          <div className="space-y-2">
            <Label className="text-sm">Môn thể thao</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ sportIds: [] })}
                  className="text-xs"
                >
                  Tất cả
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateFilters({ sportIds: sports.map((s) => s.id) })
                  }
                  className="text-xs"
                  disabled={loadingSports}
                >
                  Chọn tất cả
                </Button>
              </div>
              <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                {loadingSports ? (
                  <div className="text-center text-sm text-gray-500 py-2">
                    Đang tải...
                  </div>
                ) : sports.length > 0 ? (
                  sports.map((sport) => (
                    <div
                      key={sport.id}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        id={`sport-${sport.id}`}
                        checked={filters.sportIds.includes(sport.id)}
                        onCheckedChange={(checked) => {
                          const newSportIds = checked
                            ? [...filters.sportIds, sport.id]
                            : filters.sportIds.filter((id) => id !== sport.id);
                          updateFilters({ sportIds: newSportIds });
                        }}
                      />
                      <Label
                        htmlFor={`sport-${sport.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {sport.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 py-2">
                    Không có môn thể thao
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {filters.sportIds.length === 0
                  ? "Tất cả môn thể thao"
                  : `${filters.sportIds.length} môn được chọn`}
              </div>
            </div>
          </div>
        )}

        {/* Year Filter */}
        <div className="space-y-2">
          <Label className="text-sm">Năm</Label>
          <Input
            type="number"
            placeholder="Năm (VD: 2025)"
            className="w-full"
            value={filters.year}
            onChange={(e) => updateFilters({ year: e.target.value })}
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-sm">Trạng thái</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilters({ statuses: [] })}
                className="text-xs"
              >
                Tất cả
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateFilters({
                    statuses: STATUS_OPTIONS.map((s) => s.value),
                  })
                }
                className="text-xs"
              >
                Chọn tất cả
              </Button>
            </div>
            <div className="border rounded-md p-2">
              {STATUS_OPTIONS.map((status) => (
                <div
                  key={status.value}
                  className="flex items-center space-x-2 py-1"
                >
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.statuses.includes(status.value)}
                    onCheckedChange={(checked) => {
                      const newStatuses = checked
                        ? [...filters.statuses, status.value]
                        : filters.statuses.filter((s) => s !== status.value);
                      updateFilters({ statuses: newStatuses });
                    }}
                  />
                  <Label
                    htmlFor={`status-${status.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500">
              {filters.statuses.length === 0
                ? "Tất cả trạng thái"
                : `${filters.statuses.length} trạng thái`}
            </div>
          </div>
        </div>

        {/* Team Type Filter */}
        <div className="space-y-2">
          <Label className="text-sm">Loại đội</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilters({ teamTypes: [] })}
                className="text-xs"
              >
                Tất cả
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateFilters({ teamTypes: TEAM_TYPES.map((t) => t.value) })
                }
                className="text-xs"
              >
                Chọn tất cả
              </Button>
            </div>
            <div className="border rounded-md p-2">
              {TEAM_TYPES.map((teamType) => (
                <div
                  key={teamType.value}
                  className="flex items-center space-x-2 py-1"
                >
                  <Checkbox
                    id={`teamType-${teamType.value}`}
                    checked={filters.teamTypes.includes(teamType.value)}
                    onCheckedChange={(checked) => {
                      const newTeamTypes = checked
                        ? [...filters.teamTypes, teamType.value]
                        : filters.teamTypes.filter((t) => t !== teamType.value);
                      updateFilters({ teamTypes: newTeamTypes });
                    }}
                  />
                  <Label
                    htmlFor={`teamType-${teamType.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {teamType.label}
                  </Label>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500">
              {filters.teamTypes.length === 0
                ? "Tất cả loại đội"
                : `${filters.teamTypes.length} loại đội`}
            </div>
          </div>
        </div>

        {/* Sort Options */}
        {showSort && (
          <div className="space-y-2">
            <Label className="text-sm">Sắp xếp</Label>
            <div className="flex gap-2">
              <Select
                value={filters.sortBy}
                onValueChange={(value: "startDate" | "teamName") =>
                  updateFilters({ sortBy: value })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateFilters({
                    sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
                  })
                }
                className="px-3"
                title={`Sắp xếp ${
                  filters.sortOrder === "asc" ? "tăng dần" : "giảm dần"
                }`}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              {filters.sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
