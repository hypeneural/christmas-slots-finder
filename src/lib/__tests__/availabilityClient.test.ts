import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AvailabilityClient, QueryFilters, PostBody } from '../availabilityClient';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AvailabilityClient', () => {
  let client: AvailabilityClient;

  beforeEach(() => {
    client = new AvailabilityClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('buildQueryFromFilters', () => {
    it('should build empty query params when no filters provided', () => {
      const params = client.buildQueryFromFilters();
      expect(params.toString()).toBe('');
    });

    it('should build query params from filters', () => {
      const filters: QueryFilters = {
        tz: 'America/Sao_Paulo',
        page: 2,
        perPage: 50,
        dateFrom: '2025-11-15',
        dateTo: '2025-12-24',
        daysOfWeek: ['Monday', 'Tuesday', 'Friday'],
        onlyWeekends: false,
        timeOfDay: ['morning', 'afternoon'],
        timeStart: '09:00',
        timeEnd: '18:00',
        onlyAfter18: true,
        exactTime: '14:00',
        minSlotsPerDate: 2,
      };

      const params = client.buildQueryFromFilters(filters);
      
      expect(params.get('tz')).toBe('America/Sao_Paulo');
      expect(params.get('page')).toBe('2');
      expect(params.get('perPage')).toBe('50');
      expect(params.get('dateFrom')).toBe('2025-11-15');
      expect(params.get('dateTo')).toBe('2025-12-24');
      expect(params.get('daysOfWeek')).toBe('Monday,Tuesday,Friday');
      expect(params.get('onlyWeekends')).toBe('false');
      expect(params.get('timeOfDay')).toBe('morning,afternoon');
      expect(params.get('timeStart')).toBe('09:00');
      expect(params.get('timeEnd')).toBe('18:00');
      expect(params.get('onlyAfter18')).toBe('true');
      expect(params.get('exactTime')).toBe('14:00');
      expect(params.get('minSlotsPerDate')).toBe('2');
    });

    it('should handle undefined and null values correctly', () => {
      const filters: QueryFilters = {
        tz: undefined,
        page: undefined,
        onlyWeekends: undefined,
        exactTime: null,
      };

      const params = client.buildQueryFromFilters(filters);
      
      expect(params.get('tz')).toBeNull();
      expect(params.get('page')).toBeNull();
      expect(params.get('onlyWeekends')).toBeNull();
      expect(params.get('exactTime')).toBeNull();
    });

    it('should convert arrays to CSV format', () => {
      const filters: QueryFilters = {
        daysOfWeek: ['Monday', 'Tuesday', 'Wednesday'],
        timeOfDay: ['morning', 'evening'],
      };

      const params = client.buildQueryFromFilters(filters);
      
      expect(params.get('daysOfWeek')).toBe('Monday,Tuesday,Wednesday');
      expect(params.get('timeOfDay')).toBe('morning,evening');
    });
  });

  describe('getAvailability', () => {
    const mockSuccessResponse = {
      success: true,
      timestamp: '2025-01-01T10:00:00Z',
      package: {
        id: 1,
        code: 'HOHOHO',
        name: 'Pacote HOHOHO',
        durationMinutes: 15,
        bufferMinutes: 60,
        url: null,
      },
      availability: {
        period: {
          startDate: '2025-11-15',
          endDate: '2025-12-24',
          timezone: 'America/Sao_Paulo',
        },
        rulesUsed: [],
      },
      processedSlots: {
        all: { '2025-11-15': ['09:00', '10:00'] },
        afterHours: { '2025-11-15': ['18:00'] },
        saturdays: { '2025-11-15': ['09:00'] },
        sundaysHolidays: {},
      },
      pagination: {
        currentPage: 1,
        totalPages: 5,
        perPage: 30,
        totalDays: 10,
        hasNextPage: true,
        hasPrevPage: false,
      },
      filters: {
        available: {
          dateRange: { min: '2025-11-15', max: '2025-12-24' },
          daysOfWeek: [],
          timePeriods: [],
          shortcuts: {
            onlyWeekends: { enabled: false, slotCount: 0 },
            onlyWeekdays: { enabled: false, slotCount: 0 },
            onlyAfter18: { enabled: false, slotCount: 0 },
            businessHours: { enabled: false, slotCount: 0 },
          },
        },
        applied: {
          dateRange: { from: '2025-11-15', to: '2025-12-24' },
          daysOfWeek: [],
          timeRange: { start: null, end: null },
          periods: [],
          onlyWeekends: false,
          onlyAfter18: false,
          exactTime: null,
          minSlotsPerDate: 1,
        },
      },
      googleCalendar: {
        ignoredEvents: [],
        hasError: false,
        error: null,
      },
      metadata: {
        generatedAt: '2025-01-01T10:00:00Z',
        version: '1.0.0',
        source: 'api',
        blockWithBuffer: true,
      },
    };

    it('should make GET request with correct URL and return data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
      });

      const result = await client.getAvailability('HOHOHO', {
        dateFrom: '2025-11-15',
        dateTo: '2025-12-24',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('pack=HOHOHO'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('dateFrom=2025-11-15'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('dateTo=2025-12-24'),
        expect.any(Object)
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it('should handle API errors', async () => {
      const errorResponse = {
        success: false,
        error: 'Invalid package code',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(client.getAvailability('INVALID')).rejects.toThrow('API Error: Invalid package code');
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(client.getAvailability('HOHOHO')).rejects.toThrow('HTTP 404: Not Found');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(client.getAvailability('HOHOHO')).rejects.toThrow('Network error');
    });

    it('should handle timeout', async () => {
      const clientWithShortTimeout = new AvailabilityClient({ timeoutMs: 100 });
      
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 200))
      );

      await expect(clientWithShortTimeout.getAvailability('HOHOHO')).rejects.toThrow('Request timeout after 100ms');
    });
  });

  describe('postAvailability', () => {
    const mockSuccessResponse = {
      success: true,
      timestamp: '2025-01-01T10:00:00Z',
      package: {
        id: 1,
        code: 'ENTAO',
        name: 'Pacote ENTAO',
        durationMinutes: 30,
        bufferMinutes: 60,
        url: null,
      },
      availability: {
        period: {
          startDate: '2025-11-15',
          endDate: '2025-12-24',
          timezone: 'America/Sao_Paulo',
        },
        rulesUsed: [],
      },
      processedSlots: {
        all: { '2025-11-15': ['09:00', '10:00'] },
        afterHours: { '2025-11-15': ['18:00'] },
        saturdays: { '2025-11-15': ['09:00'] },
        sundaysHolidays: {},
      },
      pagination: {
        currentPage: 1,
        totalPages: 5,
        perPage: 30,
        totalDays: 10,
        hasNextPage: true,
        hasPrevPage: false,
      },
      filters: {
        available: {
          dateRange: { min: '2025-11-15', max: '2025-12-24' },
          daysOfWeek: [],
          timePeriods: [],
          shortcuts: {
            onlyWeekends: { enabled: false, slotCount: 0 },
            onlyWeekdays: { enabled: false, slotCount: 0 },
            onlyAfter18: { enabled: false, slotCount: 0 },
            businessHours: { enabled: false, slotCount: 0 },
          },
        },
        applied: {
          dateRange: { from: '2025-11-15', to: '2025-12-24' },
          daysOfWeek: [],
          timeRange: { start: null, end: null },
          periods: [],
          onlyWeekends: false,
          onlyAfter18: false,
          exactTime: null,
          minSlotsPerDate: 1,
        },
      },
      googleCalendar: {
        ignoredEvents: [],
        hasError: false,
        error: null,
      },
      metadata: {
        generatedAt: '2025-01-01T10:00:00Z',
        version: '1.0.0',
        source: 'api',
        blockWithBuffer: true,
      },
    };

    it('should make POST request with correct headers and body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
      });

      const body: PostBody = {
        filters: {
          request: {
            applied: {
              dateRange: { from: '2025-11-15', to: '2025-12-24' },
              daysOfWeek: { enabled: true, days: ['Monday', 'Tuesday'] },
            },
          },
        },
      };

      const result = await client.postAvailability('ENTAO', body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('pack=ENTAO'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
      );
      expect(result).toEqual(mockSuccessResponse);
    });
  });

  describe('arrayToCsv', () => {
    it('should convert arrays to CSV format', () => {
      const client = new AvailabilityClient();
      type ClientWithArrayToCsv = { arrayToCsv(values: string[]): string };
      const arrayToCsv = (client as unknown as ClientWithArrayToCsv).arrayToCsv.bind(client);
      
      expect(arrayToCsv(['Monday', 'Tuesday', 'Friday'])).toBe('Monday,Tuesday,Friday');
      expect(arrayToCsv(['morning', 'afternoon'])).toBe('morning,afternoon');
      expect(arrayToCsv([])).toBe('');
    });
  });
});
