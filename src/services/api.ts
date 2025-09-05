import type { AvailabilityData, Package } from '../types';
import mockData from '../mocks/availability.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Fetch availability data for a package
 * Currently returns mock data, but structure is ready for real API
 */
export async function fetchAvailability(packageSlug: string): Promise<AvailabilityData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (API_BASE_URL) {
    // Future: Real API call
    const response = await fetch(`${API_BASE_URL}/availability/${packageSlug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch availability: ${response.statusText}`);
    }
    return response.json();
  }
  
  // Return mock data for now
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
 * Fetch all packages
 */
export async function fetchPackages(): Promise<Package[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (API_BASE_URL) {
    // Future: Real API call
    const response = await fetch(`${API_BASE_URL}/packages`);
    if (!response.ok) {
      throw new Error(`Failed to fetch packages: ${response.statusText}`);
    }
    return response.json();
  }
  
  return mockData.packages as Package[];
}