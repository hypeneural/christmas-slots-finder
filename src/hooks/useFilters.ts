import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Filters, DayCode, TimeOfDay, FiltersURLState } from '../types';
import { countActiveFilters, triggerHaptic } from '../lib/filters';

const STORAGE_KEY = 'christmas-slots-filters';

/**
 * Convert Filters to URL params
 */
function filtersToURL(filters: Filters): FiltersURLState {
  const urlState: FiltersURLState = {};
  
  if (filters.dateFrom) urlState.df = filters.dateFrom;
  if (filters.dateTo) urlState.dt = filters.dateTo;
  if (filters.daysOfWeek?.length) urlState.dow = filters.daysOfWeek.join(',');
  if (filters.onlyWeekends) urlState.wknd = '1';
  if (filters.timeOfDay?.length) urlState.tod = filters.timeOfDay.join(',');
  if (filters.timeRange) urlState.tr = `${filters.timeRange[0]}-${filters.timeRange[1]}`;
  if (filters.onlyAfter18) urlState.a18 = '1';
  if (filters.exactTime) urlState.xt = filters.exactTime;
  if (filters.minSlotsPerDate) urlState.min = filters.minSlotsPerDate.toString();
  
  return urlState;
}

/**
 * Convert URL params to Filters
 */
function urlToFilters(urlState: FiltersURLState): Filters {
  const filters: Filters = {};
  
  if (urlState.df) filters.dateFrom = urlState.df;
  if (urlState.dt) filters.dateTo = urlState.dt;
  if (urlState.dow) filters.daysOfWeek = urlState.dow.split(',') as DayCode[];
  if (urlState.wknd === '1') filters.onlyWeekends = true;
  if (urlState.tod) filters.timeOfDay = urlState.tod.split(',') as TimeOfDay[];
  if (urlState.tr) {
    const [start, end] = urlState.tr.split('-');
    if (start && end) filters.timeRange = [start, end];
  }
  if (urlState.a18 === '1') filters.onlyAfter18 = true;
  if (urlState.xt) filters.exactTime = urlState.xt;
  if (urlState.min) filters.minSlotsPerDate = parseInt(urlState.min, 10);
  
  return filters;
}

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFiltersState] = useState<Filters>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Load initial filters from URL or localStorage
  useEffect(() => {
    const urlFilters = urlToFilters(Object.fromEntries(searchParams.entries()));
    
    if (Object.keys(urlFilters).length > 0) {
      setFiltersState(urlFilters);
    } else {
      // Try to load from localStorage
      try {
        const savedFilters = localStorage.getItem(STORAGE_KEY);
        if (savedFilters) {
          const parsed = JSON.parse(savedFilters);
          setFiltersState(parsed);
        }
      } catch (error) {
        console.warn('Failed to load saved filters:', error);
      }
    }
    // Intentionally load the initial URL snapshot once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when filters change
  const updateURL = useCallback((newFilters: Filters) => {
    const urlState = filtersToURL(newFilters);
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Clear all filter params first
    ['df', 'dt', 'dow', 'wknd', 'tod', 'tr', 'a18', 'xt', 'min'].forEach(key => {
      newSearchParams.delete(key);
    });
    
    // Add new filter params
    Object.entries(urlState).forEach(([key, value]) => {
      if (value !== undefined) {
        newSearchParams.set(key, value);
      }
    });
    
    // Reset page to 1 when filters change
    newSearchParams.set('page', '1');
    
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  // Save to localStorage
  const saveToStorage = useCallback((newFilters: Filters) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
    } catch (error) {
      console.warn('Failed to save filters:', error);
    }
  }, []);

  const setFilters = useCallback((newFilters: Filters) => {
    setFiltersState(newFilters);
    updateURL(newFilters);
    saveToStorage(newFilters);
    triggerHaptic('success');
  }, [updateURL, saveToStorage]);

  const clearFilters = useCallback(() => {
    const emptyFilters: Filters = {};
    setFiltersState(emptyFilters);
    updateURL(emptyFilters);
    saveToStorage(emptyFilters);
    triggerHaptic('light');
  }, [updateURL, saveToStorage]);

  const updateFilter = useCallback((key: keyof Filters, value: Filters[keyof Filters] | null | '') => {
    const newFilters = { ...filters, [key]: value };
    if (value === undefined || value === null || value === '') {
      delete newFilters[key];
    }
    setFilters(newFilters);
  }, [filters, setFilters]);

  const openSheet = useCallback(() => {
    setIsSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  const activeCount = countActiveFilters(filters);
  const hasActiveFilters = activeCount > 0;

  return {
    filters,
    setFilters,
    clearFilters,
    updateFilter,
    activeCount,
    hasActiveFilters,
    isSheetOpen,
    openSheet,
    closeSheet
  };
}
