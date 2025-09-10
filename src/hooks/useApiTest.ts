import { useState, useEffect } from 'react';
import { AvailabilityClient } from '../lib/availabilityClient';
import { getApiBaseUrl, getTimeoutMs, getDefaultTimezone } from '../lib/apiConfig';

interface ApiTestResult {
  success: boolean;
  error?: string;
  data?: any;
  responseTime?: number;
}

export function useApiTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiTestResult | null>(null);

  const testApi = async (packageCode: string = 'HOHOHO') => {
    setIsLoading(true);
    setResult(null);

    const startTime = Date.now();

    try {
      const client = new AvailabilityClient({
        baseUrl: getApiBaseUrl(),
        timeoutMs: getTimeoutMs(),
        defaultTZ: getDefaultTimezone(),
      });

      console.log('Testing API with package:', packageCode);
      console.log('API Configuration:', {
        baseUrl: getApiBaseUrl(),
        timeoutMs: getTimeoutMs(),
        defaultTZ: getDefaultTimezone(),
      });

      const data = await client.getAvailability(packageCode);
      const responseTime = Date.now() - startTime;

      console.log('API test successful:', { responseTime, data });
      
      setResult({
        success: true,
        data,
        responseTime,
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.log('API test failed:', { error: errorMessage, responseTime });
      
      setResult({
        success: false,
        error: errorMessage,
        responseTime,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    result,
    testApi,
  };
}

