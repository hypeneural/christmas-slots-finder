import { z } from 'zod';
import type {
  AvailabilityData,
  AvailableFilters,
  Categorized,
  CustomerFlow,
  DayCode,
  Filters,
  Package,
  PackageCta,
  TimeOfDay,
} from '../types';

const HhMmSchema = z.string().regex(/^\d{2}:\d{2}$/);
const IsoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const PublicProductSchema = z.object({
  slug: z.string(),
  code: z.string().nullable().optional(),
  name: z.string(),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  durationMinutes: z.number().nullable().optional(),
  bufferMinutes: z.number().nullable().optional(),
  badges: z.array(z.string()).nullable().optional(),
  durationLabel: z.string().nullable().optional(),
  availabilityLabel: z.string().nullable().optional(),
  isFeatured: z.boolean().optional(),
  cta: z.record(z.unknown()).optional(),
  customerFlow: z.record(z.unknown()).optional(),
});

const PublicCampaignSchema = z.object({
  data: z.object({
    slug: z.string(),
    name: z.string(),
    period: z.object({
      startsOn: IsoDateSchema,
      endsOn: IsoDateSchema,
      timezone: z.string(),
    }),
    theme: z.record(z.unknown()).optional(),
    copy: z.record(z.unknown()).optional(),
    customerFlow: z.record(z.unknown()).optional(),
    cta: z.record(z.unknown()).optional(),
    filters: z.record(z.unknown()).optional(),
    products: z.array(PublicProductSchema),
  }),
  meta: z.object({
    apiVersion: z.string(),
    rulesVersion: z.number(),
    generatedAt: z.string(),
  }).optional(),
});

const AvailabilitySlotSchema = z.object({
  time: HhMmSchema,
  startsAt: z.string(),
  endsAt: z.string(),
  blockEndsAt: z.string(),
  durationMinutes: z.number(),
  bufferMinutes: z.number(),
  blockWindowMinutes: z.number(),
  isAfterHours: z.boolean(),
});

const AvailabilityDaySchema = z.object({
  date: IsoDateSchema,
  dayOfWeek: z.string(),
  isWeekend: z.boolean(),
  isHoliday: z.boolean(),
  slots: z.array(AvailabilitySlotSchema),
});

const FilterOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const PublicAvailableFiltersSchema = z.object({
  daysOfWeek: z.array(z.string()).optional(),
  daysOfWeekOptions: z.array(FilterOptionSchema).optional(),
  timePeriods: z.array(z.string()).optional(),
  timePeriodOptions: z.array(FilterOptionSchema).optional(),
  times: z.array(HhMmSchema).optional(),
  holidayDates: z.array(IsoDateSchema).optional(),
  hasHolidays: z.boolean().optional(),
  hasAfterHours: z.boolean().optional(),
}).passthrough();

const PublicAvailabilitySchema = z.object({
  data: z.object({
    campaign: z.object({
      slug: z.string(),
      name: z.string(),
      timezone: z.string(),
    }),
    product: z.object({
      slug: z.string(),
      code: z.string().nullable().optional(),
      name: z.string(),
      durationMinutes: z.number().nullable().optional(),
      bufferMinutes: z.number().nullable().optional(),
      blockWindowMinutes: z.number().nullable().optional(),
    }),
    slotsByDate: z.array(AvailabilityDaySchema),
    pagination: z.object({
      currentPage: z.number(),
      perPage: z.number(),
      totalDays: z.number(),
      totalPages: z.number(),
      hasNextPage: z.boolean(),
    }),
    googleCalendar: z.object({
      checked: z.boolean(),
      hasError: z.boolean(),
    }),
    filters: z.object({
      available: PublicAvailableFiltersSchema.optional(),
      applied: z.unknown().optional(),
    }).optional(),
  }),
  meta: z.object({
    apiVersion: z.string(),
    rulesVersion: z.number(),
    generatedAt: z.string(),
    cache: z.object({
      hit: z.boolean(),
      ttlSeconds: z.number(),
    }).optional(),
  }),
});

export type PublicCampaign = z.infer<typeof PublicCampaignSchema>['data'];
export type PublicAvailability = z.infer<typeof PublicAvailabilitySchema>['data'] & {
  meta: z.infer<typeof PublicAvailabilitySchema>['meta'];
};

export interface CrmAgendaFilters extends Filters {
  onlyHolidays?: boolean;
}

export interface CrmAvailabilityResult {
  data: AvailabilityData;
  categorized: Categorized;
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    totalDays: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  availableFilters: AvailableFilters;
}

const campaignCache = new Map<string, PublicCampaign>();

export function getCrmAgendaBaseUrl(): string {
  return (
    import.meta.env.VITE_AGENDA_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'https://evydencia.com/api/public/v1/agenda'
  ).replace(/\/+$/, '');
}

export function getCrmAgendaCampaignSlug(): string {
  return import.meta.env.VITE_AGENDA_CAMPAIGN_SLUG || 'natal';
}

export function isCrmAgendaApiEnabled(): boolean {
  return import.meta.env.VITE_USE_REAL_API !== 'false';
}

export function isMockFallbackEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';
}

export async function fetchCrmCampaign(
  campaignSlug: string = getCrmAgendaCampaignSlug(),
  baseUrl: string = getCrmAgendaBaseUrl()
): Promise<PublicCampaign> {
  const cacheKey = `${baseUrl}:${campaignSlug}`;
  const cached = campaignCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await fetch(`${baseUrl}/campaigns/${encodeURIComponent(campaignSlug)}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao carregar campanha (${response.status})`);
  }

  const payload = PublicCampaignSchema.parse(await response.json());
  campaignCache.set(cacheKey, payload.data);

  return payload.data;
}

export async function fetchCrmPackages(): Promise<Package[]> {
  const campaign = await fetchCrmCampaign();

  return campaign.products.map(mapPublicProductToPackage);
}

export async function fetchCrmAvailability(
  packageSlug: string,
  filters: CrmAgendaFilters = {},
  page = 1,
  perPage = 30
): Promise<CrmAvailabilityResult> {
  const campaign = await fetchCrmCampaign();
  const params = buildAvailabilityParams(packageSlug, campaign, filters, page, perPage);
  const baseUrl = getCrmAgendaBaseUrl();
  const campaignSlug = getCrmAgendaCampaignSlug();
  const url = `${baseUrl}/campaigns/${encodeURIComponent(campaignSlug)}/availability?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao carregar horarios (${response.status})`);
  }

  const payload = PublicAvailabilitySchema.parse(await response.json());
  const availability = {
    ...payload.data,
    meta: payload.meta,
  };

  return adaptCrmAvailability(campaign, availability, filters);
}

function buildAvailabilityParams(
  packageSlug: string,
  campaign: PublicCampaign,
  filters: CrmAgendaFilters,
  page: number,
  perPage: number
): URLSearchParams {
  const params = new URLSearchParams();
  params.set('package', packageSlug);
  params.set('dateFrom', filters.dateFrom || campaign.period.startsOn);
  params.set('dateTo', filters.dateTo || campaign.period.endsOn);
  params.set('page', String(page));
  params.set('perPage', String(perPage));

  if (filters.daysOfWeek?.length) {
    params.set('daysOfWeek', filters.daysOfWeek.map(convertDayCodeToApiFormat).join(','));
  }

  if (filters.onlyWeekends) {
    params.set('onlyWeekends', '1');
  }

  if (filters.onlyHolidays) {
    params.set('onlyHolidays', '1');
  }

  if (filters.timeOfDay?.length) {
    params.set('timeOfDay', filters.timeOfDay.map(convertTimeOfDayToApiFormat).join(','));
  }

  if (filters.timeRange) {
    params.set('timeStart', filters.timeRange[0]);
    params.set('timeEnd', filters.timeRange[1]);
  }

  if (filters.onlyAfter18) {
    params.set('onlyAfter18', '1');
  }

  if (filters.exactTime) {
    params.set('exactTime', filters.exactTime);
  }

  if (filters.minSlotsPerDate) {
    params.set('minSlotsPerDate', String(filters.minSlotsPerDate));
  }

  return params;
}

function adaptCrmAvailability(
  campaign: PublicCampaign,
  availability: PublicAvailability,
  filters: CrmAgendaFilters
): CrmAvailabilityResult {
  const categorized = categorizeAvailabilityDays(availability.slotsByDate);
  const products = campaign.products.map((product, index) => ({
    ...mapPublicProductToPackage(product, index),
  }));
  const selectedProduct = products.find((product) => product.slug === availability.product.slug) ?? {
    id: 1,
    slug: availability.product.slug,
    name: availability.product.name,
    durationMinutes: availability.product.durationMinutes ?? 0,
    badges: [],
  };

  return {
    data: {
      packages: products,
      availability: {
        packageId: selectedProduct.id,
        startDate: filters.dateFrom || campaign.period.startsOn,
        endDate: filters.dateTo || campaign.period.endsOn,
        minAdvanceHours: 0,
        eventDurationMinutes: availability.product.durationMinutes ?? selectedProduct.durationMinutes,
        weekAvailability: convertSlotsToWeekAvailability(categorized.all),
        specificDateAvailability: categorized.all,
        holidays: availability.slotsByDate
          .filter((day) => day.isHoliday)
          .reduce<Record<string, { name: string; times: string[] }>>((holidays, day) => {
            holidays[day.date] = {
              name: 'Data especial',
              times: day.slots.map((slot) => slot.time),
            };

            return holidays;
          }, {}),
        busyEvents: [],
      },
    },
    categorized,
    pagination: {
      currentPage: availability.pagination.currentPage,
      totalPages: availability.pagination.totalPages,
      perPage: availability.pagination.perPage,
      totalDays: availability.pagination.totalDays,
      hasNextPage: availability.pagination.hasNextPage,
      hasPrevPage: availability.pagination.currentPage > 1,
    },
    availableFilters: mapPublicAvailableFilters(availability.filters?.available),
  };
}

function mapPublicProductToPackage(
  product: PublicCampaign['products'][number],
  index: number
): Package {
  return {
    id: index + 1,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle ?? null,
    description: product.description ?? null,
    durationMinutes: product.durationMinutes ?? 0,
    durationLabel: product.durationLabel ?? null,
    availabilityLabel: product.availabilityLabel ?? null,
    badges: product.badges ?? [],
    isFeatured: product.isFeatured ?? false,
    cta: product.cta as PackageCta | undefined,
    customerFlow: product.customerFlow as CustomerFlow | undefined,
  };
}

function categorizeAvailabilityDays(days: Array<z.infer<typeof AvailabilityDaySchema>>): Categorized {
  return days.reduce<Categorized>((categorized, day) => {
    const times = day.slots.map((slot) => slot.time);
    const afterHours = day.slots.filter((slot) => slot.isAfterHours).map((slot) => slot.time);

    if (times.length > 0) {
      categorized.all[day.date] = times;
    }

    if (afterHours.length > 0) {
      categorized.afterHours[day.date] = afterHours;
    }

    if (day.dayOfWeek === 'Saturday' && times.length > 0) {
      categorized.saturdays[day.date] = times;
    }

    if ((day.dayOfWeek === 'Sunday' || day.isHoliday) && times.length > 0) {
      categorized.sundaysHolidays[day.date] = times;
    }

    return categorized;
  }, {
    all: {},
    afterHours: {},
    saturdays: {},
    sundaysHolidays: {},
  });
}

function convertSlotsToWeekAvailability(slots: Record<string, string[]>) {
  const weekAvailability = {
    Monday: [] as string[],
    Tuesday: [] as string[],
    Wednesday: [] as string[],
    Thursday: [] as string[],
    Friday: [] as string[],
    Saturday: [] as string[],
    Sunday: [] as string[],
  };

  Object.entries(slots).forEach(([date, times]) => {
    const dayOfWeek = getDayOfWeekFromDate(date);

    weekAvailability[dayOfWeek] = [...new Set([...weekAvailability[dayOfWeek], ...times])].sort();
  });

  return weekAvailability;
}

function convertDayCodeToApiFormat(dayCode: string): string {
  const dayMap: Record<string, string> = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday',
  };

  return dayMap[dayCode] || dayCode;
}

function mapPublicAvailableFilters(
  available?: z.infer<typeof PublicAvailableFiltersSchema>
): AvailableFilters {
  const dayOptions = (available?.daysOfWeekOptions ?? [])
    .map((option) => {
      const value = convertApiDayToDayCode(option.value);

      return value ? { value, label: option.label } : null;
    })
    .filter((option): option is { value: DayCode; label: string } => option !== null);

  const daysFromList = (available?.daysOfWeek ?? [])
    .map(convertApiDayToDayCode)
    .filter((day): day is DayCode => day !== null);

  const daysOfWeekOptions = uniqueByValue([
    ...dayOptions,
    ...daysFromList.map((day) => ({ value: day, label: dayCodeLabel(day) })),
  ]);

  const timeOptions = (available?.timePeriodOptions ?? [])
    .map((option) => {
      const value = convertApiTimePeriodToUi(option.value);

      return value ? { value, label: option.label } : null;
    })
    .filter((option): option is { value: TimeOfDay; label: string } => option !== null);

  const timePeriodsFromList = (available?.timePeriods ?? [])
    .map(convertApiTimePeriodToUi)
    .filter((period): period is TimeOfDay => period !== null);

  const timePeriodOptions = uniqueByValue([
    ...timeOptions,
    ...timePeriodsFromList.map((period) => ({ value: period, label: timePeriodLabel(period) })),
  ]);

  return {
    daysOfWeek: daysOfWeekOptions.map((option) => option.value),
    daysOfWeekOptions,
    timePeriods: timePeriodOptions.map((option) => option.value),
    timePeriodOptions,
    times: [...new Set(available?.times ?? [])].sort(),
    holidayDates: [...new Set(available?.holidayDates ?? [])].sort(),
    hasHolidays: available?.hasHolidays ?? (available?.holidayDates?.length ?? 0) > 0,
    hasAfterHours: available?.hasAfterHours ?? timePeriodOptions.some((option) => option.value === 'after18'),
  };
}

function convertApiDayToDayCode(value: string): DayCode | null {
  const normalized = normalizeOptionValue(value);
  const dayMap: Record<string, DayCode> = {
    sunday: 'Sun',
    domingo: 'Sun',
    sun: 'Sun',
    monday: 'Mon',
    segunda: 'Mon',
    segundafeira: 'Mon',
    mon: 'Mon',
    tuesday: 'Tue',
    terca: 'Tue',
    tercafeira: 'Tue',
    tue: 'Tue',
    wednesday: 'Wed',
    quarta: 'Wed',
    quartafeira: 'Wed',
    wed: 'Wed',
    thursday: 'Thu',
    quinta: 'Thu',
    quintafeira: 'Thu',
    thu: 'Thu',
    friday: 'Fri',
    sexta: 'Fri',
    sextafeira: 'Fri',
    fri: 'Fri',
    saturday: 'Sat',
    sabado: 'Sat',
    sat: 'Sat',
  };

  return dayMap[normalized] ?? null;
}

function convertApiTimePeriodToUi(value: string): TimeOfDay | null {
  const normalized = normalizeOptionValue(value);
  const periodMap: Record<string, TimeOfDay> = {
    morning: 'morning',
    manha: 'morning',
    afternoon: 'afternoon',
    tarde: 'afternoon',
    evening: 'evening',
    noite: 'evening',
    afterhours: 'after18',
    after18: 'after18',
    apos18: 'after18',
    aposhorariocomercial: 'after18',
  };

  return periodMap[normalized] ?? null;
}

function normalizeOptionValue(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

function uniqueByValue<TValue extends string>(options: Array<{ value: TValue; label: string }>) {
  const seen = new Set<TValue>();

  return options.filter((option) => {
    if (seen.has(option.value)) {
      return false;
    }

    seen.add(option.value);
    return true;
  });
}

function dayCodeLabel(day: DayCode): string {
  const labels: Record<DayCode, string> = {
    Sun: 'Domingo',
    Mon: 'Segunda-feira',
    Tue: 'Terça-feira',
    Wed: 'Quarta-feira',
    Thu: 'Quinta-feira',
    Fri: 'Sexta-feira',
    Sat: 'Sábado',
  };

  return labels[day];
}

function timePeriodLabel(period: TimeOfDay): string {
  const labels: Record<TimeOfDay, string> = {
    morning: 'Manhã',
    afternoon: 'Tarde',
    evening: 'Noite',
    after18: 'Após horário comercial',
  };

  return labels[period];
}

function convertTimeOfDayToApiFormat(timeOfDay: string): string {
  const periodMap: Record<string, string> = {
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    after18: 'after_hours',
  };

  return periodMap[timeOfDay] || timeOfDay;
}

function getDayOfWeekFromDate(dateStr: string): keyof ReturnType<typeof convertSlotsToWeekAvailability> {
  const date = new Date(`${dateStr}T12:00:00`);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

  return days[date.getDay()];
}
