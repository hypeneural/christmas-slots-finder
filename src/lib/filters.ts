import { format, parseISO, isWeekend, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Filters, DayCode, TimeOfDay, Holidays } from '../types';

// Day mapping for Portuguese locale
const DAY_MAPPING: Record<number, DayCode> = {
  0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
};

// Time of day ranges
const TIME_RANGES: Record<TimeOfDay, [string, string]> = {
  morning: ['06:00', '12:00'],
  afternoon: ['12:00', '18:00'],
  evening: ['18:00', '22:00'],
  after18: ['18:00', '23:59']
};

/**
 * Apply filters to available slots
 */
export function applyFilters(
  allSlotsByDate: Record<string, string[]>,
  filters: Filters,
  tz: string = 'America/Sao_Paulo'
): Record<string, string[]> {
  if (!filters || Object.keys(filters).length === 0) {
    return allSlotsByDate;
  }

  const filteredSlots: Record<string, string[]> = {};

  for (const [dateStr, times] of Object.entries(allSlotsByDate)) {
    // Filter by date range
    if (filters.dateFrom && dateStr < filters.dateFrom) continue;
    if (filters.dateTo && dateStr > filters.dateTo) continue;

    // Filter by day of week
    const dateObj = parseISO(dateStr);
    const dayOfWeek = DAY_MAPPING[getDay(dateObj)];
    
    if (filters.onlyWeekends && !isWeekend(dateObj)) continue;
    if (filters.daysOfWeek?.length && !filters.daysOfWeek.includes(dayOfWeek)) continue;

    // Filter times
    let filteredTimes = [...times];

    // Filter by time of day
    if (filters.timeOfDay?.length) {
      filteredTimes = filteredTimes.filter(time => {
        return filters.timeOfDay!.some(tod => {
          const [start, end] = TIME_RANGES[tod];
          return time >= start && time <= end;
        });
      });
    }

    // Filter by onlyAfter18 shortcut
    if (filters.onlyAfter18) {
      filteredTimes = filteredTimes.filter(time => time >= '18:00');
    }

    // Filter by custom time range
    if (filters.timeRange) {
      const [rangeStart, rangeEnd] = filters.timeRange;
      filteredTimes = filteredTimes.filter(time => 
        time >= rangeStart && time <= rangeEnd
      );
    }

    // Filter by exact time
    if (filters.exactTime) {
      filteredTimes = filteredTimes.filter(time => time === filters.exactTime);
    }

    // Filter by minimum slots per date
    if (filters.minSlotsPerDate && filteredTimes.length < filters.minSlotsPerDate) {
      continue;
    }

    if (filteredTimes.length > 0) {
      filteredSlots[dateStr] = filteredTimes;
    }
  }

  return filteredSlots;
}

/**
 * Count active filters for display
 */
export function countActiveFilters(filters: Filters): number {
  let count = 0;
  
  if (filters.dateFrom || filters.dateTo) count++;
  if (filters.daysOfWeek?.length) count++;
  if (filters.onlyWeekends) count++;
  if (filters.onlyHolidays) count++;
  if (filters.timeOfDay?.length) count++;
  if (filters.timeRange) count++;
  if (filters.onlyAfter18) count++;
  if (filters.exactTime) count++;
  if (filters.minSlotsPerDate) count++;
  
  return count;
}

/**
 * Get filter summary chips for display
 */
export function getFilterSummary(filters: Filters): string[] {
  const chips: string[] = [];

  // Date range
  if (filters.dateFrom && filters.dateTo) {
    const start = format(parseISO(filters.dateFrom), 'dd/MM', { locale: ptBR });
    const end = format(parseISO(filters.dateTo), 'dd/MM', { locale: ptBR });
    chips.push(`${start} - ${end}`);
  } else if (filters.dateFrom) {
    const start = format(parseISO(filters.dateFrom), 'dd/MM', { locale: ptBR });
    chips.push(`A partir de ${start}`);
  } else if (filters.dateTo) {
    const end = format(parseISO(filters.dateTo), 'dd/MM', { locale: ptBR });
    chips.push(`Até ${end}`);
  }

  // Days of week
  if (filters.onlyWeekends) {
    chips.push('Finais de semana');
  } else if (filters.daysOfWeek?.length) {
    const dayLabels: Record<DayCode, string> = {
      Sun: 'Dom', Mon: 'Seg', Tue: 'Ter', Wed: 'Qua', 
      Thu: 'Qui', Fri: 'Sex', Sat: 'Sáb'
    };
    const days = filters.daysOfWeek.map(d => dayLabels[d]).join(', ');
    chips.push(days);
  }

  if (filters.onlyHolidays) {
    chips.push('Somente feriados');
  }

  // Time filters
  if (filters.onlyAfter18) {
    chips.push('Após 18h');
  } else if (filters.timeOfDay?.length) {
    const timeLabels: Record<TimeOfDay, string> = {
      morning: 'Manhã', afternoon: 'Tarde', evening: 'Noite', after18: 'Após 18h'
    };
    const times = filters.timeOfDay.map(t => timeLabels[t]).join(', ');
    chips.push(times);
  }

  // Custom time range
  if (filters.timeRange) {
    const [start, end] = filters.timeRange;
    chips.push(`${start} - ${end}`);
  }

  // Exact time
  if (filters.exactTime) {
    chips.push(`Exato: ${filters.exactTime}`);
  }

  // Min slots
  if (filters.minSlotsPerDate) {
    chips.push(`Min ${filters.minSlotsPerDate} horários`);
  }

  return chips;
}

/**
 * Haptic feedback helper
 */
export function triggerHaptic(kind: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'medium') {
  if ('vibrate' in navigator) {
    const patterns: Record<string, number | number[]> = {
      light: 12,
      medium: 25,
      heavy: 50,
      success: [12, 50, 12],
      warning: [25, 25, 25]
    };
    navigator.vibrate(patterns[kind]);
  }
}
