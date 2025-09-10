import type { AvailabilityData, Package } from '../types';
import { AvailabilityClient } from '../lib/availabilityClient';
import { 
  adaptApiResponseToAvailabilityData, 
  adaptApiResponseToCategorized,
  adaptFiltersToApiFilters,
  getPackageCodeFromSlug, 
  isValidPackageSlug 
} from '../lib/apiAdapter';
import { API_CONFIG, isRealApiEnabled, getApiBaseUrl } from '../lib/apiConfig';
import mockData from '../mocks/availability.json';

const client = new AvailabilityClient({
  baseUrl: getApiBaseUrl(),
  timeoutMs: API_CONFIG.TIMEOUT_MS,
  defaultTZ: API_CONFIG.DEFAULT_TZ,
});

/**
 * Fetch availability data for a package
 * Uses real API when enabled, falls back to mock data
 */
export async function fetchAvailability(packageSlug: string): Promise<AvailabilityData> {
  // Check if package slug is valid
  if (!isValidPackageSlug(packageSlug)) {
    throw new Error(`Invalid package slug: ${packageSlug}`);
  }

  // Use real API if enabled
  if (isRealApiEnabled()) {
    try {
      const packageCode = getPackageCodeFromSlug(packageSlug);
      if (!packageCode) {
        throw new Error(`Package code not found for slug: ${packageSlug}`);
      }

      const apiResponse = await client.getAvailability(packageCode);
      return adaptApiResponseToAvailabilityData(apiResponse, packageSlug);
    } catch (error) {
      console.error('Real API failed, falling back to mock data:', error);
      // Fall through to mock data
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
  filters?: any,
  page: number = 1,
  perPage: number = 30
): Promise<{ data: AvailabilityData; categorized: any; pagination: any }> {
  if (!isValidPackageSlug(packageSlug)) {
    throw new Error(`Invalid package slug: ${packageSlug}`);
  }

  const packageCode = getPackageCodeFromSlug(packageSlug);
  if (!packageCode) {
    throw new Error(`Package code not found for slug: ${packageSlug}`);
  }

  try {
    // Convert filters to API format
    const apiFilters = adaptFiltersToApiFilters(filters);
    apiFilters.page = page;
    apiFilters.perPage = perPage;

    // Fetch from real API
    const apiResponse = await client.getAvailability(packageCode, apiFilters);
    
    // Convert to template format
    const availabilityData = adaptApiResponseToAvailabilityData(apiResponse, packageSlug);
    const categorized = adaptApiResponseToCategorized(apiResponse);
    
    return {
      data: availabilityData,
      categorized,
      pagination: {
        currentPage: apiResponse.pagination.currentPage,
        totalPages: apiResponse.pagination.totalPages,
        perPage: apiResponse.pagination.perPage,
        totalDays: apiResponse.pagination.totalDays,
        hasNextPage: apiResponse.pagination.hasNextPage,
        hasPrevPage: apiResponse.pagination.hasPrevPage,
      }
    };
  } catch (error) {
    console.error('Failed to fetch availability with filters:', error);
    throw error;
  }
}

/**
 * Fetch all packages
 */
export async function fetchPackages(): Promise<Package[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // For now, always return mock data for packages
  // In the future, this could be replaced with a real API call
  
  return mockData.packages as Package[];
}