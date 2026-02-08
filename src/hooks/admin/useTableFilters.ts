import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/common/useDebounce";

interface TableFilterParams {
  search?: string;
  page?: number;
  size?: number;
  [key: string]: any;
}

interface UseTableFiltersOptions<T extends TableFilterParams> {
  initialParams: T;
  debounceDelay?: number;
}

/**
 * Custom hook for managing table filters with search, pagination, and custom filters
 * Automatically debounces search input to avoid excessive API calls
 */
export function useTableFilters<T extends TableFilterParams>({
  initialParams,
  debounceDelay = 500,
}: UseTableFiltersOptions<T>) {
  const [params, setParams] = useState<T>(initialParams);
  
  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(params.search || "", debounceDelay);

  // Get debounced params for API calls
  const debouncedParams = {
    ...params,
    search: debouncedSearch,
  };

  // Update search value
  const setSearch = useCallback((search: string) => {
    setParams((prev) => ({ ...prev, search, page: 0 })); // Reset to first page on search
  }, []);

  // Update a specific filter
  const setFilter = useCallback((key: string, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value, page: 0 })); // Reset to first page on filter change
  }, []);

  // Update multiple filters at once
  const setFilters = useCallback((filters: Partial<T>) => {
    setParams((prev) => ({ ...prev, ...filters, page: 0 }));
  }, []);

  // Update page number
  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  // Update page size
  const setPageSize = useCallback((size: number) => {
    setParams((prev) => ({ ...prev, size, page: 0 })); // Reset to first page on size change
  }, []);

  // Reset all filters to initial state
  const resetFilters = useCallback(() => {
    setParams(initialParams);
  }, [initialParams]);

  return {
    params,
    debouncedParams,
    setSearch,
    setFilter,
    setFilters,
    setPage,
    setPageSize,
    resetFilters,
  };
}
