import { useState, useEffect, useCallback } from 'react';
import { fetchAvailability } from '../services/api';
import { buildAvailableSlots, categorizeSlots, paginateDates } from '../lib/scheduling';
import type { CategorizedPaged, Package, AvailabilityData, Filters, CategoryKey, Categorized } from '../types';

interface UseInfiniteAvailabilityResult {
  categorizedPaged: CategorizedPaged | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  packageMeta: Package | null;
  loadMore: (category: CategoryKey) => Promise<void>;
  refetch: () => void;
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
  
  // Keep track of current pages for each category
  const [currentPages, setCurrentPages] = useState<Record<CategoryKey, number>>({
    all: 1,
    afterHours: 1,
    saturdays: 1,
    sundaysHolidays: 1
  });
  
  // Store all categorized data (not paginated) for infinite loading
  const [allCategorizedData, setAllCategorizedData] = useState<Categorized | null>(null);

  const loadInitialData = async () => {
    if (!packageSlug) return;

    setLoading(true);
    setError(null);

    try {
      const data: AvailabilityData = await fetchAvailability(packageSlug);
      
      // Find package metadata
      const pkg = data.packages.find(p => p.slug === packageSlug);
      setPackageMeta(pkg || null);

      // Process availability data with filters
      const availableSlots = buildAvailableSlots(
        { packages: data.packages, availability: data.availability },
        'America/Sao_Paulo',
        filters
      );

      const categorized = categorizeSlots(
        availableSlots,
        data.availability.holidays
      );

      // Store all data for infinite loading
      setAllCategorizedData(categorized);

      // Reset pages when filters change
      const resetPages = {
        all: 1,
        afterHours: 1,
        saturdays: 1,
        sundaysHolidays: 1
      };
      setCurrentPages(resetPages);

      // Get initial paginated data (page 1 for all categories)
      const paginated = paginateDates(categorized, perPage, 1);
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
    if (!allCategorizedData || loadingMore) return;

    const nextPage = currentPages[category] + 1;
    
    setLoadingMore(true);

    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get data for the next page
      const singleCategoryData: Categorized = {
        all: category === 'all' ? allCategorizedData.all : {},
        afterHours: category === 'afterHours' ? allCategorizedData.afterHours : {},
        saturdays: category === 'saturdays' ? allCategorizedData.saturdays : {},
        sundaysHolidays: category === 'sundaysHolidays' ? allCategorizedData.sundaysHolidays : {}
      };
      
      const nextPageData = paginateDates(singleCategoryData, perPage, nextPage);

      // Check if there's more data to load
      if (Object.keys(nextPageData[category].slots).length === 0) {
        setLoadingMore(false);
        return;
      }

      // Merge new data with existing data
      setCategorizedPaged(prevData => {
        if (!prevData) return prevData;

        return {
          ...prevData,
          [category]: {
            ...prevData[category],
            slots: {
              ...prevData[category].slots,
              ...nextPageData[category].slots
            },
            currentPage: nextPage
          }
        };
      });

      // Update current page for this category
      setCurrentPages(prev => ({
        ...prev,
        [category]: nextPage
      }));

    } finally {
      setLoadingMore(false);
    }
  }, [allCategorizedData, currentPages, perPage, loadingMore]);

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
    refetch: loadInitialData
  };
}
