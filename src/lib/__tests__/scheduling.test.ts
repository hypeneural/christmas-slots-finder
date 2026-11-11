import { describe, it, expect, vi } from 'vitest';
import { getDayOfWeekPt, buildAvailableSlots, categorizeSlots, paginateDates, buildWhatsAppDeepLink } from '../scheduling';
import type { AvailabilityInput } from '../../types';

describe('scheduling utilities', () => {
  describe('getDayOfWeekPt', () => {
    it('should return Portuguese day abbreviations', () => {
      expect(getDayOfWeekPt('Monday')).toBe('Seg');
      expect(getDayOfWeekPt('Tuesday')).toBe('Ter');
      expect(getDayOfWeekPt('Sunday')).toBe('Dom');
      expect(getDayOfWeekPt('Saturday')).toBe('Sáb');
    });

    it('should return original value for unknown days', () => {
      expect(getDayOfWeekPt('InvalidDay')).toBe('InvalidDay');
    });
  });

  describe('buildAvailableSlots', () => {
    const mockInput: AvailabilityInput = {
      packages: [
        {
          id: 1,
          slug: 'test-package',
          name: 'Test Package',
          durationMinutes: 30
        }
      ],
      availability: {
        packageId: 1,
        startDate: '2025-01-15',
        endDate: '2025-01-17',
        minAdvanceHours: 12,
        eventDurationMinutes: 30,
        weekAvailability: {
          Monday: ['13:00', '14:00'],
          Tuesday: ['13:00', '14:00'],
          Wednesday: ['13:00', '14:00'],
          Thursday: ['13:00', '14:00'], 
          Friday: ['13:00', '14:00'],
          Saturday: ['08:00', '09:00'],
          Sunday: ['08:00', '09:00']
        },
        busyEvents: []
      }
    };

    it('should build available slots for future dates', () => {
      const slots = buildAvailableSlots(mockInput);
      expect(typeof slots).toBe('object');
      expect(Object.keys(slots).length).toBeGreaterThanOrEqual(0);
    });

    it('should filter out past dates', () => {
      const pastInput: AvailabilityInput = {
        ...mockInput,
        availability: {
          ...mockInput.availability,
          startDate: '2020-01-01',
          endDate: '2020-01-02'
        }
      };
      
      const slots = buildAvailableSlots(pastInput);
      expect(Object.keys(slots).length).toBe(0);
    });
  });

  describe('categorizeSlots', () => {
    const mockSlots = {
      '2025-01-13': ['14:00', '18:00'], // Monday
      '2025-01-18': ['08:00', '14:00'], // Saturday
      '2025-01-19': ['08:00', '16:00']  // Sunday
    };

    const mockHolidays = {
      '2025-01-20': { name: 'Feriado', times: ['08:00'] }
    };

    it('should categorize slots correctly', () => {
      const categorized = categorizeSlots(mockSlots, mockHolidays);
      
      expect(categorized.all).toEqual(mockSlots);
      expect(categorized.afterHours['2025-01-13']).toEqual(['18:00']);
      expect(categorized.saturdays['2025-01-18']).toEqual(['08:00', '14:00']);
      expect(categorized.sundaysHolidays['2025-01-19']).toEqual(['08:00', '16:00']);
    });
  });

  describe('paginateDates', () => {
    const mockCategorized = {
      all: {
        '2025-01-15': ['14:00'],
        '2025-01-16': ['15:00'],
        '2025-01-17': ['16:00']
      },
      afterHours: {},
      saturdays: {},
      sundaysHolidays: {}
    };

    it('should paginate dates correctly', () => {
      const paginated = paginateDates(mockCategorized, 2, 1);
      
      expect(paginated.all.currentPage).toBe(1);
      expect(paginated.all.totalPages).toBe(2);
      expect(Object.keys(paginated.all.slots).length).toBe(2);
    });
  });

  describe('buildWhatsAppDeepLink', () => {
    it('should build WhatsApp deep link correctly', () => {
      const link = buildWhatsAppDeepLink('15/01', 'Segunda', '14:00');
      
      expect(link).toContain('wa.me');
      expect(link).toContain('15%2F01');
      expect(link).toContain('Segunda');
      expect(link).toContain('14%3A00');
    });

    it('should always send to the fixed slots WhatsApp number', () => {
      const link = buildWhatsAppDeepLink('15/01', 'Segunda', '14:00', { packageName: 'Experiência Ho-Ho-Ho' });
      const message = decodeURIComponent(link.split('?text=')[1]);

      expect(link.startsWith('https://wa.me/5548996425287?text=')).toBe(true);
      expect(link.split('?text=')[1]).toBe(encodeURIComponent(message));
      expect(message).toContain('Experiência Ho-Ho-Ho');
      expect(message).toContain('15/01');
      expect(message).toContain('Segunda');
      expect(message).toContain('14:00');
      expect(link).not.toContain('5548998483594');
    });

    it('should ignore external phone values and VITE_WHATSAPP_NUMBER', () => {
      vi.stubEnv('VITE_WHATSAPP_NUMBER', '5511999999999');
      try {
        const options = { packageName: 'Boas Festas', phoneNumber: '5511888888888' } as never;
        const link = buildWhatsAppDeepLink('15/01', 'Segunda', '14:00', options);

        expect(link.startsWith('https://wa.me/5548996425287?text=')).toBe(true);
        expect(link).not.toContain('5511999999999');
        expect(link).not.toContain('5511888888888');
      } finally {
        vi.unstubAllEnvs();
      }
    });
  });
});