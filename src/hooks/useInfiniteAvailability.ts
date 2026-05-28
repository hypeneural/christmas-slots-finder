import { useState, useEffect, useCallback } from 'react';
import { fetchAvailability, fetchAvailabilityWithFilters } from '../services/api';
import { buildAvailableSlots, categorizeSlots, paginateDates } from '../lib/scheduling';
import { isRealApiEnabled } from '../lib/apiConfig';
import type { CrmAvailabilityResult } from '../lib/crmAgendaApi';
import type { CategorizedPaged, Package, AvailabilityData, Filters, CategoryKey, Categorized, AvailableFilters } from '../types';

interface UseInfiniteAvailabilityResult {
  categorizedPaged: CategorizedPaged | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  packageMeta: Package | null;
  availableFilters: AvailableFilters | null;
  loadMore: (category: CategoryKey) => Promise<void>;
  refetch: () => void;
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

export function useInfiniteAvailability(
  packageSlug: string | undefined,
  perPage: number = 30,
  filters?: Filters
): UseInfiniteAvailabilityResult {
  const [categorizedPaged, setCategorizedPaged] = useState<CategorizedPaged | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageMeta, setPackageMeta] = useState<Package | null>(null);
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  // Store all accumulated categorized data for infinite loading
  const [allCategorizedData, setAllCategorizedData] = useState<Categorized | null>(null);

  const loadInitialData = useCallback(async () => {
    if (!packageSlug) return;

    setLoading(true);
    setError(null);

    try {
      let data: AvailabilityData;
      let categorized: Categorized;
      let pagination: CrmAvailabilityResult['pagination'] | null = null;

      if (isRealApiEnabled()) {
        // Use real API with filters
        const result = await fetchAvailabilityWithFilters(packageSlug, filters, 1, perPage);
        data = result.data;
        categorized = result.categorized;
        pagination = result.pagination;
        
        setCurrentPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
        setHasNextPage(pagination.hasNextPage);
        setAvailableFilters(result.availableFilters);
      } else {
        // Use mock data (existing logic)
        data = await fetchAvailability(packageSlug);
        
        // Process availability data with filters
        const availableSlots = buildAvailableSlots(
          { packages: data.packages, availability: data.availability },
          'America/Sao_Paulo',
          filters
        );

        categorized = categorizeSlots(
          availableSlots,
          data.availability.holidays
        );
        
        // Mock pagination for local data
        setCurrentPage(1);
        setTotalPages(1);
        setHasNextPage(false);
        setAvailableFilters(null);
      }
      
      // Find package metadata
      const pkg = data.packages.find(p => p.slug === packageSlug);
      setPackageMeta(pkg || null);

      // Store all data for infinite loading
      setAllCategorizedData(categorized);

      // Get initial paginated data - show ALL data for infinite scroll
      const paginated = {
        all: {
          slots: categorized.all,
          totalPages: 1,
          currentPage: 1
        },
        afterHours: {
          slots: categorized.afterHours,
          totalPages: 1,
          currentPage: 1
        },
        saturdays: {
          slots: categorized.saturdays,
          totalPages: 1,
          currentPage: 1
        },
        sundaysHolidays: {
          slots: categorized.sundaysHolidays,
          totalPages: 1,
          currentPage: 1
        }
      };
      setCategorizedPaged(paginated);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar horários');
      setCategorizedPaged(null);
      setPackageMeta(null);
      setAvailableFilters(null);
      setAllCategorizedData(null);
    } finally {
      setLoading(false);
    }
  }, [packageSlug, filters, perPage]);

  const loadMore = useCallback(async (category: CategoryKey) => {
    if (!hasNextPage || loadingMore || !packageSlug) return;

    const nextPage = currentPage + 1;
    setLoadingMore(true);

    try {
      if (isRealApiEnabled()) {
        // Use real API for pagination
        const result = await fetchAvailabilityWithFilters(packageSlug, filters, nextPage, perPage);
        const newCategorized = result.categorized;
        const pagination = result.pagination;

        setCurrentPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
        setHasNextPage(pagination.hasNextPage);
        setAvailableFilters(result.availableFilters);

        // Merge new data with existing accumulated data and update view
        setAllCategorizedData(prevData => {
          if (!prevData) {
            const paginated = {
              all: {
                slots: newCategorized.all,
                totalPages: 1,
                currentPage: 1
              },
              afterHours: {
                slots: newCategorized.afterHours,
                totalPages: 1,
                currentPage: 1
              },
              saturdays: {
                slots: newCategorized.saturdays,
                totalPages: 1,
                currentPage: 1
              },
              sundaysHolidays: {
                slots: newCategorized.sundaysHolidays,
                totalPages: 1,
                currentPage: 1
              }
            };
            setCategorizedPaged(paginated);
            return newCategorized;
          }

          const mergedData = {
            all: { ...prevData.all, ...newCategorized.all },
            afterHours: { ...prevData.afterHours, ...newCategorized.afterHours },
            saturdays: { ...prevData.saturdays, ...newCategorized.saturdays },
            sundaysHolidays: { ...prevData.sundaysHolidays, ...newCategorized.sundaysHolidays }
          };

          // Update paginated view with merged data - show ALL data for infinite scroll
          const paginated = {
            all: {
              slots: mergedData.all,
              totalPages: 1,
              currentPage: 1
            },
            afterHours: {
              slots: mergedData.afterHours,
              totalPages: 1,
              currentPage: 1
            },
            saturdays: {
              slots: mergedData.saturdays,
              totalPages: 1,
              currentPage: 1
            },
            sundaysHolidays: {
              slots: mergedData.sundaysHolidays,
              totalPages: 1,
              currentPage: 1
            }
          };
          setCategorizedPaged(paginated);

          return mergedData;
        });

      } else {
        // Use mock data (existing logic)
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));

        // For mock data, we don't have real pagination, so just return
        setLoadingMore(false);
        return;
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mais horários');
    } finally {
      setLoadingMore(false);
    }
  }, [hasNextPage, currentPage, loadingMore, packageSlug, filters, perPage]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    categorizedPaged,
    loading,
    loadingMore,
    error,
    packageMeta,
    availableFilters,
    loadMore,
    refetch: loadInitialData,
    hasNextPage,
    currentPage,
    totalPages
  };
}
