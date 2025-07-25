export interface ConcentrationFilters {
  sportIds: number[];
  teamTypes: string[];
  statuses: string[];
  year: string;
  sortBy: "startDate" | "teamName";
  sortOrder: "asc" | "desc";
  combinedSort:
    | "startDate_desc"
    | "startDate_asc"
    | "teamName_asc"
    | "teamName_desc";
}

export interface ConcentrationFilterState extends ConcentrationFilters {
  page: number;
  limit: number;
}

export interface ConcentrationFilterProps {
  filters: ConcentrationFilters;
  onFiltersChange: (filters: ConcentrationFilters) => void;
  showSports?: boolean;
  showSort?: boolean;
  compact?: boolean;
  className?: string;
}

export interface UseConcentrationFilterOptions {
  initialFilters?: Partial<ConcentrationFilters>;
  defaultStatuses?: string[];
  defaultYear?: string;
}

export interface Sport {
  id: number;
  name: string;
}

export const TEAM_TYPES = [
  { value: "ADULT", label: "Đội tuyển" },
  { value: "JUNIOR", label: "Đội trẻ" },
  { value: "DISABILITY", label: "Đội người khuyết tật" },
] as const;

export const STATUS_OPTIONS = [
  { value: "upcoming", label: "Chưa diễn ra" },
  { value: "active", label: "Đang diễn ra" },
  { value: "completed", label: "Đã kết thúc" },
] as const;

export const SORT_OPTIONS = [
  { value: "startDate_desc", label: "Ngày bắt đầu (Mới nhất)" },
  { value: "startDate_asc", label: "Ngày bắt đầu (Cũ nhất)" },
  { value: "teamName_asc", label: "Tên đội (A-Z)" },
  { value: "teamName_desc", label: "Tên đội (Z-A)" },
] as const;

export const CONCENTRATION_FILTER_DEFAULTS = {
  sportIds: [] as number[],
  teamTypes: [] as string[],
  statuses: [] as string[],
  year: new Date().getFullYear().toString(),
  sortBy: "startDate" as const,
  sortOrder: "desc" as const,
  combinedSort: "startDate_desc" as const,
} as const;
