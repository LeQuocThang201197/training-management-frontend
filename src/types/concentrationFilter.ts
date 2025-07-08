export interface ConcentrationFilters {
  sportIds: number[];
  teamTypes: string[];
  statuses: string[];
  year: string;
  sortBy: "startDate" | "teamName";
  sortOrder: "asc" | "desc";
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
  { value: "ADULT", label: "Tuyển quốc gia" },
  { value: "JUNIOR", label: "Đội trẻ" },
  { value: "DISABILITY", label: "Paralympic" },
] as const;

export const STATUS_OPTIONS = [
  { value: "upcoming", label: "Chưa diễn ra" },
  { value: "active", label: "Đang diễn ra" },
  { value: "completed", label: "Đã kết thúc" },
] as const;

export const SORT_OPTIONS = [
  { value: "startDate", label: "Ngày bắt đầu" },
  { value: "teamName", label: "Tên đội" },
] as const;
