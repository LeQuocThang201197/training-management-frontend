import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";
import {
  ConcentrationFilters,
  ConcentrationFilterState,
  UseConcentrationFilterOptions,
  Sport,
  CONCENTRATION_FILTER_DEFAULTS,
} from "@/types/concentrationFilter";

export function useConcentrationFilter(
  options: UseConcentrationFilterOptions = {}
) {
  const {
    initialFilters = {},
    defaultStatuses = CONCENTRATION_FILTER_DEFAULTS.statuses,
    defaultYear = CONCENTRATION_FILTER_DEFAULTS.year,
  } = options;

  // Filter states
  const [filters, setFilters] = useState<ConcentrationFilters>({
    sportIds: CONCENTRATION_FILTER_DEFAULTS.sportIds,
    teamTypes: CONCENTRATION_FILTER_DEFAULTS.teamTypes,
    statuses: defaultStatuses,
    year: defaultYear,
    sortBy: CONCENTRATION_FILTER_DEFAULTS.sortBy,
    sortOrder: CONCENTRATION_FILTER_DEFAULTS.sortOrder,
    combinedSort: CONCENTRATION_FILTER_DEFAULTS.combinedSort,
    ...initialFilters,
  });

  // Sports data
  const [sports, setSports] = useState<Sport[]>([]);
  const [loadingSports, setLoadingSports] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // Fetch sports data
  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoadingSports(true);
        const response = await fetch(`${API_URL}/sports`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSports(data.data);
          }
        }
      } catch (err) {
        console.error("Fetch sports error:", err);
      } finally {
        setLoadingSports(false);
      }
    };

    fetchSports();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    filters.sportIds,
    filters.teamTypes,
    filters.statuses,
    filters.year,
    filters.sortBy,
    filters.sortOrder,
  ]);

  // Build API parameters
  const buildAPIParams = () => {
    const params = new URLSearchParams();

    // Sport filter (multiple values)
    if (filters.sportIds.length > 0) {
      params.append("sportId", filters.sportIds.join(","));
    }

    // Team type filter (multiple values)
    if (filters.teamTypes.length > 0) {
      params.append("teamType", filters.teamTypes.join(","));
    }

    // Status filter (multiple values)
    if (filters.statuses.length > 0) {
      params.append("status", filters.statuses.join(","));
    }

    // Year filter
    if (filters.year) {
      params.append("year", filters.year);
    }

    // Sort options
    params.append("sortBy", filters.sortBy);
    params.append("sortOrder", filters.sortOrder);

    // Pagination
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    return params;
  };

  // Helper functions for updating specific filters
  const updateSportIds = (sportIds: number[]) => {
    setFilters((prev) => ({ ...prev, sportIds }));
  };

  const updateTeamTypes = (teamTypes: string[]) => {
    setFilters((prev) => ({ ...prev, teamTypes }));
  };

  const updateStatuses = (statuses: string[]) => {
    setFilters((prev) => ({ ...prev, statuses }));
  };

  const updateYear = (year: string) => {
    setFilters((prev) => ({ ...prev, year }));
  };

  const updateSort = (
    sortBy: "startDate" | "teamName",
    sortOrder: "asc" | "desc"
  ) => {
    const combinedSort =
      `${sortBy}_${sortOrder}` as ConcentrationFilters["combinedSort"];
    setFilters((prev) => ({ ...prev, sortBy, sortOrder, combinedSort }));
  };

  const updateCombinedSort = (
    combinedSort: ConcentrationFilters["combinedSort"]
  ) => {
    const [sortBy, sortOrder] = combinedSort.split("_") as [
      "startDate" | "teamName",
      "asc" | "desc"
    ];
    setFilters((prev) => ({ ...prev, sortBy, sortOrder, combinedSort }));
  };

  const resetFilters = () => {
    setFilters({
      sportIds: CONCENTRATION_FILTER_DEFAULTS.sportIds,
      teamTypes: CONCENTRATION_FILTER_DEFAULTS.teamTypes,
      statuses: defaultStatuses,
      year: defaultYear,
      sortBy: CONCENTRATION_FILTER_DEFAULTS.sortBy,
      sortOrder: CONCENTRATION_FILTER_DEFAULTS.sortOrder,
      combinedSort: CONCENTRATION_FILTER_DEFAULTS.combinedSort,
      ...initialFilters,
    });
    setPage(1);
  };

  // Complete state object
  const filterState: ConcentrationFilterState = {
    ...filters,
    page,
    limit,
  };

  return {
    filters,
    setFilters,
    sports,
    loadingSports,
    page,
    setPage,
    limit,
    filterState,
    buildAPIParams,
    updateSportIds,
    updateTeamTypes,
    updateStatuses,
    updateYear,
    updateSort,
    updateCombinedSort,
    resetFilters,
  };
}
