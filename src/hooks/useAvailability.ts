import { useState, useEffect } from 'react';
import { fetchAvailability } from '../services/api';
import { buildAvailableSlots, categorizeSlots, paginateDates } from '../lib/scheduling';
import type { CategorizedPaged, Package, AvailabilityData, Filters } from '../types';

interface UseAvailabilityResult {
  categorizedPaged: CategorizedPaged | null;
  loading: boolean;
  error: string | null;
  packageMeta: Package | null;
  refetch: () => void;
}

export function useAvailability(
  packageSlug: string | undefined,
  page: number = 1,
  perPage: number = 10,
  filters?: Filters
): UseAvailabilityResult {
  const [categorizedPaged, setCategorizedPaged] = useState<CategorizedPaged | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageMeta, setPackageMeta] = useState<Package | null>(null);

  const loadAvailability = async () => {
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

      const paginated = paginateDates(categorized, perPage, page);
      setCategorizedPaged(paginated);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar horários');
      setCategorizedPaged(null);
      setPackageMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [packageSlug, page, perPage, filters]);

  return {
    categorizedPaged,
    loading,
    error,
    packageMeta,
    refetch: loadAvailability
  };
}