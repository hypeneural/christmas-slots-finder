import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AvailabilityClient, QueryFilters, ApiSuccess, ApiError } from '../lib/availabilityClient';

// ============================================================================
// HOOK OPTIONS
// ============================================================================

export interface UseAvailabilityOptions {
  pack: "HOHOHO" | "ENTAO" | "BOAS" | number;
  filters?: QueryFilters;
  enabled?: boolean;
  client?: AvailabilityClient;
  cacheKey?: string;
}

// ============================================================================
// HOOK STATE
// ============================================================================

export interface UseAvailabilityState {
  data: ApiSuccess | null;
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;
  totalPages: number;
  totalDays: number;
}

// ============================================================================
// HOOK ACTIONS
// ============================================================================

export interface UseAvailabilityActions {
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  loadPage: (page: number) => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// HOOK RESULT
// ============================================================================

export interface UseAvailabilityResult extends UseAvailabilityState, UseAvailabilityActions {
  // Computed values
  slots: Record<string, string[]>;
  allSlots: Record<string, string[]>;
  afterHoursSlots: Record<string, string[]>;
  saturdaySlots: Record<string, string[]>;
  sundayHolidaySlots: Record<string, string[]>;
  
  // Package info
  packageInfo: ApiSuccess['package'] | null;
  
  // Filters info
  availableFilters: ApiSuccess['filters']['available'] | null;
  appliedFilters: ApiSuccess['filters']['applied'] | null;
  
  // Google Calendar info
  googleCalendar: ApiSuccess['googleCalendar'] | null;
  
  // Metadata
  metadata: ApiSuccess['metadata'] | null;
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

interface CacheEntry {
  data: ApiSuccess;
  timestamp: number;
  ttl: number;
}

class AvailabilityCache {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: ApiSuccess, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get(key: string): ApiSuccess | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

const cache = new AvailabilityCache();

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useAvailability(options: UseAvailabilityOptions): UseAvailabilityResult {
  const {
    pack,
    filters = {},
    enabled = true,
    client = new AvailabilityClient(),
    cacheKey,
  } = options;

  // State
  const [state, setState] = useState<UseAvailabilityState>({
    data: null,
    loading: false,
    error: null,
    hasNextPage: false,
    hasPrevPage: false,
    currentPage: 1,
    totalPages: 0,
    totalDays: 0,
  });

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Memoized cache key
  const effectiveCacheKey = useMemo(() => {
    if (cacheKey) return cacheKey;
    
    const filtersStr = JSON.stringify(filters);
    return `${pack}-${filtersStr}`;
  }, [pack, filters, cacheKey]);

  // Computed values
  const slots = useMemo(() => state.data?.processedSlots.all || {}, [state.data]);
  const allSlots = useMemo(() => state.data?.processedSlots.all || {}, [state.data]);
  const afterHoursSlots = useMemo(() => state.data?.processedSlots.afterHours || {}, [state.data]);
  const saturdaySlots = useMemo(() => state.data?.processedSlots.saturdays || {}, [state.data]);
  const sundayHolidaySlots = useMemo(() => state.data?.processedSlots.sundaysHolidays || {}, [state.data]);
  
  const packageInfo = state.data?.package || null;
  const availableFilters = state.data?.filters.available || null;
  const appliedFilters = state.data?.filters.applied || null;
  const googleCalendar = state.data?.googleCalendar || null;
  const metadata = state.data?.metadata || null;

  // Fetch function
  const fetchData = useCallback(async (page?: number, append = false) => {
    if (!enabled) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    const targetPage = page ?? filters.page ?? 1;
    const requestFilters = { ...filters, page: targetPage };

    // Check cache first
    const cacheKey = `${effectiveCacheKey}-page-${targetPage}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && !append) {
      setState(prev => ({
        ...prev,
        data: cachedData,
        loading: false,
        error: null,
        hasNextPage: cachedData.pagination.hasNextPage,
        hasPrevPage: cachedData.pagination.hasPrevPage,
        currentPage: cachedData.pagination.currentPage,
        totalPages: cachedData.pagination.totalPages,
        totalDays: cachedData.pagination.totalDays,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const data = await client.getAvailability(pack, requestFilters, {
        signal: abortControllerRef.current.signal,
      });

      if (!mountedRef.current) return;

      // Cache the result
      cache.set(cacheKey, data);

      setState(prev => ({
        ...prev,
        data: append && prev.data ? {
          ...data,
          processedSlots: {
            all: { ...prev.data.processedSlots.all, ...data.processedSlots.all },
            afterHours: { ...prev.data.processedSlots.afterHours, ...data.processedSlots.afterHours },
            saturdays: { ...prev.data.processedSlots.saturdays, ...data.processedSlots.saturdays },
            sundaysHolidays: { ...prev.data.processedSlots.sundaysHolidays, ...data.processedSlots.sundaysHolidays },
          },
        } : data,
        loading: false,
        hasNextPage: data.pagination.hasNextPage,
        hasPrevPage: data.pagination.hasPrevPage,
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalDays: data.pagination.totalDays,
      }));
    } catch (error) {
      if (!mountedRef.current) return;

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [pack, filters, enabled, client, effectiveCacheKey]);

  // Actions
  const refetch = useCallback(() => {
    // Clear cache for this key
    const keysToDelete = Array.from(cache.cache.keys()).filter(key => 
      key.startsWith(effectiveCacheKey)
    );
    keysToDelete.forEach(key => cache.delete(key));
    
    return fetchData();
  }, [fetchData, effectiveCacheKey]);

  const loadMore = useCallback(() => {
    if (state.hasNextPage && !state.loading) {
      const nextPage = state.currentPage + 1;
      return fetchData(nextPage, true);
    }
  }, [state.hasNextPage, state.loading, state.currentPage, fetchData]);

  const loadPage = useCallback((page: number) => {
    if (page !== state.currentPage && !state.loading) {
      return fetchData(page);
    }
  }, [state.currentPage, state.loading, fetchData]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    ...state,
    
    // Computed values
    slots,
    allSlots,
    afterHoursSlots,
    saturdaySlots,
    sundayHolidaySlots,
    packageInfo,
    availableFilters,
    appliedFilters,
    googleCalendar,
    metadata,
    
    // Actions
    refetch,
    loadMore,
    loadPage,
    clearError,
  };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook para buscar todas as páginas de uma vez
 */
export function useAllAvailability(options: UseAvailabilityOptions) {
  const [allData, setAllData] = useState<ApiSuccess[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!options.enabled) return;

    setLoading(true);
    setError(null);
    setAllData([]);

    try {
      const client = options.client || new AvailabilityClient();
      const allPages: ApiSuccess[] = [];

      for await (const pageData of client.paginateAllDates(options.pack, options.filters)) {
        allPages.push(pageData);
        setAllData([...allPages]); // Update incrementally
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    data: allData,
    loading,
    error,
    refetch: fetchAll,
  };
}