import type { AvailabilityData, Package } from '../types';
import {
  fetchCrmAvailability,
  fetchCrmPackages,
  isCrmAgendaApiEnabled,
  type CrmAgendaFilters,
  type CrmAvailabilityResult,
} from '../lib/crmAgendaApi';
import mockData from '../mocks/availability.json';

/**
 * Fetch availability data for a package
 * Uses real API when enabled, falls back to mock data
 */
export async function fetchAvailability(packageSlug: string): Promise<AvailabilityData> {
  if (isCrmAgendaApiEnabled()) {
    try {
      const result = await fetchCrmAvailability(packageSlug);
      return result.data;
    } catch (error) {
      console.error('CRM agenda API failed, falling back to mock data:', error);
    }
  }

  // Fallback to mock data
  const packageData = mockData.packages.find(pkg => pkg.slug === packageSlug);
  if (!packageData) {
    throw new Error(`Package not found: ${packageSlug}`);
  }
  
  return {
    ...mockData,
    availability: {
      ...mockData.availability,
      packageId: packageData.id,
      eventDurationMinutes: packageData.durationMinutes
    }
  } as AvailabilityData;
}

/**
 * Fetch availability data with filters using real API
 */
export async function fetchAvailabilityWithFilters(
  packageSlug: string, 
  filters?: CrmAgendaFilters,
  page: number = 1,
  perPage: number = 30
): Promise<CrmAvailabilityResult> {
  try {
    return await fetchCrmAvailability(packageSlug, filters, page, perPage);
  } catch (error) {
    console.error('Failed to fetch availability with filters:', error);
    throw error;
  }
}

/**
 * Fetch all packages
 */
export async function fetchPackages(): Promise<Package[]> {
  if (isCrmAgendaApiEnabled()) {
    try {
      return await fetchCrmPackages();
    } catch (error) {
      console.error('CRM agenda packages failed, falling back to mock data:', error);
    }
  }
  
  return mockData.packages as Package[];
}
