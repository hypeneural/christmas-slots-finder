import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCrmAvailability, fetchCrmPackages } from '../crmAgendaApi';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const campaignPayload = {
  data: {
    slug: 'natal-vitest',
    name: 'Ensaios de Natal',
    period: {
      startsOn: '2026-10-01',
      endsOn: '2026-12-24',
      timezone: 'America/Sao_Paulo',
    },
    products: [
      {
        slug: 'ho-ho-ho',
        code: 'HOHOHO',
        name: 'Experiencia Ho-Ho-Ho',
        subtitle: 'Sessao rapida',
        description: 'Pacote dinamico vindo do CRM',
        durationMinutes: 15,
        bufferMinutes: 15,
        badges: ['15 min'],
        durationLabel: '15 minutos',
        availabilityLabel: 'Horarios rapidos',
        isFeatured: false,
        cta: {
          label: 'Quero esse horario',
          whatsappNumber: '5548998483594',
        },
      },
    ],
  },
  meta: {
    apiVersion: '1.0.0',
    rulesVersion: 12,
    generatedAt: '2026-05-27T10:00:00-03:00',
  },
};

const availabilityPayload = {
  data: {
    campaign: {
      slug: 'natal-vitest',
      name: 'Ensaios de Natal',
      timezone: 'America/Sao_Paulo',
    },
    product: {
      slug: 'ho-ho-ho',
      code: 'HOHOHO',
      name: 'Experiencia Ho-Ho-Ho',
      durationMinutes: 15,
      bufferMinutes: 15,
      blockWindowMinutes: 30,
    },
    slotsByDate: [
      {
        date: '2026-10-03',
        dayOfWeek: 'Saturday',
        isWeekend: true,
        isHoliday: true,
        slots: [
          {
            time: '09:00',
            startsAt: '2026-10-03T09:00:00-03:00',
            endsAt: '2026-10-03T09:15:00-03:00',
            blockEndsAt: '2026-10-03T09:30:00-03:00',
            durationMinutes: 15,
            bufferMinutes: 15,
            blockWindowMinutes: 30,
            isAfterHours: false,
          },
          {
            time: '18:00',
            startsAt: '2026-10-03T18:00:00-03:00',
            endsAt: '2026-10-03T18:15:00-03:00',
            blockEndsAt: '2026-10-03T18:30:00-03:00',
            durationMinutes: 15,
            bufferMinutes: 15,
            blockWindowMinutes: 30,
            isAfterHours: true,
          },
        ],
      },
    ],
    pagination: {
      currentPage: 2,
      perPage: 20,
      totalDays: 1,
      totalPages: 3,
      hasNextPage: true,
    },
    googleCalendar: {
      checked: true,
      hasError: false,
    },
  },
  meta: {
    apiVersion: '1.0.0',
    rulesVersion: 12,
    generatedAt: '2026-05-27T10:00:00-03:00',
    cache: {
      hit: false,
      ttlSeconds: 30,
    },
  },
};

describe('CRM public agenda API adapter', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://evydencia.com/api/public/v1/agenda');
    vi.stubEnv('VITE_AGENDA_CAMPAIGN_SLUG', 'natal-vitest');
    vi.stubEnv('VITE_USE_REAL_API', 'true');
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('loads campaign packages from the public CRM contract', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(campaignPayload),
    });

    const packages = await fetchCrmPackages();

    expect(mockFetch).toHaveBeenCalledWith(
      'https://evydencia.com/api/public/v1/agenda/campaigns/natal-vitest',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
        },
      })
    );
    expect(packages).toEqual([
      {
        id: 1,
        slug: 'ho-ho-ho',
        name: 'Experiencia Ho-Ho-Ho',
        subtitle: 'Sessao rapida',
        description: 'Pacote dinamico vindo do CRM',
        durationMinutes: 15,
        durationLabel: '15 minutos',
        availabilityLabel: 'Horarios rapidos',
        badges: ['15 min'],
        isFeatured: false,
        cta: {
          label: 'Quero esse horario',
          whatsappNumber: '5548998483594',
        },
        customerFlow: undefined,
      },
    ]);
  });

  it('maps availability filters and payload to the existing UI shape', async () => {
    vi.stubEnv('VITE_AGENDA_CAMPAIGN_SLUG', 'natal-vitest-filtered');

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          ...campaignPayload,
          data: {
            ...campaignPayload.data,
            slug: 'natal-vitest-filtered',
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(availabilityPayload),
      });

    const result = await fetchCrmAvailability('ho-ho-ho', {
      daysOfWeek: ['Sat'],
      onlyHolidays: true,
      timeRange: ['18:00', '19:00'],
      onlyAfter18: true,
    }, 2, 20);

    const availabilityUrl = String(mockFetch.mock.calls[1][0]);

    expect(availabilityUrl).toContain('/campaigns/natal-vitest-filtered/availability?');
    expect(availabilityUrl).toContain('package=ho-ho-ho');
    expect(availabilityUrl).toContain('dateFrom=2026-10-01');
    expect(availabilityUrl).toContain('dateTo=2026-12-24');
    expect(availabilityUrl).toContain('daysOfWeek=Saturday');
    expect(availabilityUrl).toContain('onlyHolidays=1');
    expect(availabilityUrl).toContain('timeStart=18%3A00');
    expect(availabilityUrl).toContain('timeEnd=19%3A00');
    expect(availabilityUrl).toContain('onlyAfter18=1');

    expect(result.categorized.all).toEqual({
      '2026-10-03': ['09:00', '18:00'],
    });
    expect(result.categorized.afterHours).toEqual({
      '2026-10-03': ['18:00'],
    });
    expect(result.categorized.saturdays).toEqual({
      '2026-10-03': ['09:00', '18:00'],
    });
    expect(result.categorized.sundaysHolidays).toEqual({
      '2026-10-03': ['09:00', '18:00'],
    });
    expect(result.pagination).toMatchObject({
      currentPage: 2,
      hasNextPage: true,
      hasPrevPage: true,
    });
  });
});
