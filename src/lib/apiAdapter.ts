import { ApiSuccess } from './availabilityClient';
import { AvailabilityData, Package, Availability, Categorized } from '../types';
import { API_CONFIG, type PackageSlug } from './apiConfig';

// ============================================================================
// ADAPTER FUNCTIONS
// ============================================================================

/**
 * Converte dados da API real para o formato esperado pelo template
 */
export function adaptApiResponseToAvailabilityData(
  apiResponse: ApiSuccess,
  packageSlug: string
): AvailabilityData {
  const packageCode = API_CONFIG.PACKAGE_MAPPING[packageSlug as PackageSlug];
  
  if (!packageCode) {
    throw new Error(`Package slug not found: ${packageSlug}`);
  }

  // Converter package da API para formato do template
  const packageData: Package = {
    id: apiResponse.package.id,
    slug: packageSlug,
    name: apiResponse.package.name,
    durationMinutes: apiResponse.package.durationMinutes,
    badges: getPackageBadges(apiResponse.package.code),
  };

  // Converter availability da API para formato do template
  const availability: Availability = {
    packageId: apiResponse.package.id,
    startDate: apiResponse.availability.period.startDate,
    endDate: apiResponse.availability.period.endDate,
    minAdvanceHours: 12, // Default, pode ser ajustado conforme necessário
    eventDurationMinutes: apiResponse.package.durationMinutes,
    weekAvailability: convertSlotsToWeekAvailability(apiResponse.processedSlots.all),
    specificDateAvailability: apiResponse.processedSlots.all,
    holidays: convertHolidaysFromApi(apiResponse.processedSlots.sundaysHolidays),
    busyEvents: convertIgnoredEventsToBusyEvents(apiResponse.googleCalendar.ignoredEvents),
  };

  return {
    packages: [packageData],
    availability,
  };
}

/**
 * Converte slots categorizados da API para o formato Categorized do template
 */
export function adaptApiResponseToCategorized(apiResponse: ApiSuccess): Categorized {
  return {
    all: apiResponse.processedSlots.all,
    afterHours: apiResponse.processedSlots.afterHours,
    saturdays: apiResponse.processedSlots.saturdays,
    sundaysHolidays: apiResponse.processedSlots.sundaysHolidays,
  };
}

/**
 * Converte filtros do template para filtros da API
 */
export function adaptFiltersToApiFilters(filters: any) {
  const apiFilters: any = {};

  // Mapear dateFrom/dateTo
  if (filters.dateFrom) {
    apiFilters.dateFrom = filters.dateFrom;
  }
  if (filters.dateTo) {
    apiFilters.dateTo = filters.dateTo;
  }

  // Mapear daysOfWeek (converter de formato abreviado para completo)
  if (filters.daysOfWeek && filters.daysOfWeek.length > 0) {
    apiFilters.daysOfWeek = filters.daysOfWeek.map((day: string) => 
      convertDayCodeToApiFormat(day)
    );
  }

  // Mapear onlyWeekends
  if (filters.onlyWeekends !== undefined) {
    apiFilters.onlyWeekends = filters.onlyWeekends;
  }

  // Mapear timeOfDay
  if (filters.timeOfDay && filters.timeOfDay.length > 0) {
    apiFilters.timeOfDay = filters.timeOfDay.map((period: string) => 
      convertTimeOfDayToApiFormat(period)
    );
  }

  // Mapear timeRange
  if (filters.timeRange && filters.timeRange.length === 2) {
    apiFilters.timeStart = filters.timeRange[0];
    apiFilters.timeEnd = filters.timeRange[1];
  }

  // Mapear onlyAfter18
  if (filters.onlyAfter18 !== undefined) {
    apiFilters.onlyAfter18 = filters.onlyAfter18;
  }

  // Mapear exactTime
  if (filters.exactTime) {
    apiFilters.exactTime = filters.exactTime;
  }

  // Mapear minSlotsPerDate
  if (filters.minSlotsPerDate !== undefined) {
    apiFilters.minSlotsPerDate = filters.minSlotsPerDate;
  }

  return apiFilters;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtém badges do pacote baseado no código da API
 */
function getPackageBadges(packageCode: string): string[] {
  switch (packageCode) {
    case 'HOHOHO':
      return ['Rápido'];
    case 'ENTAO':
      return ['Mais procurado'];
    case 'BOAS':
      return ['Mais completo'];
    default:
      return [];
  }
}

/**
 * Converte slots da API para formato WeekAvailability
 */
function convertSlotsToWeekAvailability(slots: Record<string, string[]>): any {
  const weekAvailability: any = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  // Agrupar slots por dia da semana
  Object.entries(slots).forEach(([date, times]) => {
    const dayOfWeek = getDayOfWeekFromDate(date);
    if (weekAvailability[dayOfWeek]) {
      weekAvailability[dayOfWeek] = [...new Set([...weekAvailability[dayOfWeek], ...times])].sort();
    }
  });

  return weekAvailability;
}

/**
 * Converte feriados da API para formato do template
 */
function convertHolidaysFromApi(sundaysHolidays: Record<string, string[]>): Record<string, any> {
  const holidays: Record<string, any> = {};
  
  Object.entries(sundaysHolidays).forEach(([date, times]) => {
    if (times.length > 0) {
      holidays[date] = {
        name: 'Feriado',
        times,
      };
    }
  });

  return holidays;
}

/**
 * Converte eventos ignorados do Google Calendar para BusyEvent
 */
function convertIgnoredEventsToBusyEvents(ignoredEvents: any[]): any[] {
  return ignoredEvents.map(event => ({
    start: event.start,
    end: event.end,
    summary: event.summary,
  }));
}

/**
 * Converte código de dia abreviado para formato da API
 */
function convertDayCodeToApiFormat(dayCode: string): string {
  const dayMap: Record<string, string> = {
    'Mon': 'Monday',
    'Tue': 'Tuesday', 
    'Wed': 'Wednesday',
    'Thu': 'Thursday',
    'Fri': 'Friday',
    'Sat': 'Saturday',
    'Sun': 'Sunday',
  };
  
  return dayMap[dayCode] || dayCode;
}

/**
 * Converte período do dia para formato da API
 */
function convertTimeOfDayToApiFormat(timeOfDay: string): string {
  const periodMap: Record<string, string> = {
    'morning': 'morning',
    'afternoon': 'afternoon', 
    'evening': 'evening',
    'after18': 'evening', // after18 mapeia para evening na API
  };
  
  return periodMap[timeOfDay] || timeOfDay;
}

/**
 * Obtém dia da semana a partir de uma data
 */
function getDayOfWeekFromDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/**
 * Obtém código do pacote da API baseado no slug
 */
export function getPackageCodeFromSlug(slug: string): string | null {
  return API_CONFIG.PACKAGE_MAPPING[slug as PackageSlug] || null;
}

/**
 * Verifica se um slug de pacote é válido
 */
export function isValidPackageSlug(slug: string): boolean {
  return slug in API_CONFIG.PACKAGE_MAPPING;
}
