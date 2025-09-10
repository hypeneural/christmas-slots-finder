import { useState, useEffect, useCallback } from 'react';
import { fetchAvailability, fetchAvailabilityWithFilters } from '../services/api';
import { buildAvailableSlots, categorizeSlots, paginateDates } from '../lib/scheduling';
import { isRealApiEnabled } from '../lib/apiConfig';
import type { CategorizedPaged, Package, AvailabilityData, Filters, CategoryKey, Categorized } from '../types';

interface UseInfiniteAvailabilityResult {
  categorizedPaged: CategorizedPaged | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  packageMeta: Package | null;
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  // Store all accumulated categorized data for infinite loading
  const [allCategorizedData, setAllCategorizedData] = useState<Categorized | null>(null);

  const loadInitialData = async () => {
    if (!packageSlug) return;

    setLoading(true);
    setError(null);

    try {
      let data: AvailabilityData;
      let categorized: Categorized;
      let pagination: any = null;

      if (isRealApiEnabled()) {
        // Use real API with filters
        const result = await fetchAvailabilityWithFilters(packageSlug, filters, 1, perPage);
        data = result.data;
        categorized = result.categorized;
        pagination = result.pagination;
        
        // Update pagination state
        console.log('📄 Initial pagination info:', {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.hasNextPage
        });
        setCurrentPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
        setHasNextPage(pagination.hasNextPage);
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
      setAllCategorizedData(null);
    } finally {
      setLoading(false);
    }
  };

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

        // Update pagination state
        console.log('📄 Load more pagination info:', {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.hasNextPage
        });
        setCurrentPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
        setHasNextPage(pagination.hasNextPage);

        // Merge new data with existing accumulated data and update view
        setAllCategorizedData(prevData => {
          if (!prevData) {
            console.log('🔄 First page data:', Object.keys(newCategorized.all).length, 'dates');
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

          console.log('🔄 Merging data - Previous:', Object.keys(prevData.all).length, 'dates, New:', Object.keys(newCategorized.all).length, 'dates');

          const mergedData = {
            all: { ...prevData.all, ...newCategorized.all },
            afterHours: { ...prevData.afterHours, ...newCategorized.afterHours },
            saturdays: { ...prevData.saturdays, ...newCategorized.saturdays },
            sundaysHolidays: { ...prevData.sundaysHolidays, ...newCategorized.sundaysHolidays }
          };

          console.log('🔄 Merged data:', Object.keys(mergedData.all).length, 'total dates');

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
  }, [hasNextPage, currentPage, loadingMore, packageSlug, filters, perPage, allCategorizedData]);

  useEffect(() => {
    loadInitialData();
  }, [packageSlug, filters]);

  return {
    categorizedPaged,
    loading,
    loadingMore,
    error,
    packageMeta,
    loadMore,
    refetch: loadInitialData,
    hasNextPage,
    currentPage,
    totalPages
  };
}
