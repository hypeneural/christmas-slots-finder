import { format, parseISO, isAfter, isBefore, isWeekend, getDay, addMinutes, addHours, startOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';
import type { AvailabilityInput, Categorized, CategorizedPaged, Holidays, Filters } from '../types';
import { applyFilters } from './filters';

/**
 * Get Portuguese day of week abbreviation
 */
export function getDayOfWeekPt(day: string): string {
  const dayMap: Record<string, string> = {
    'Sunday': 'Dom',
    'Monday': 'Seg',
    'Tuesday': 'Ter',
    'Wednesday': 'Qua',
    'Thursday': 'Qui',
    'Friday': 'Sex',
    'Saturday': 'Sáb'
  };
  return dayMap[day] || day;
}

/**
 * Build available time slots based on availability configuration with optional filters
 */
export function buildAvailableSlots(
  input: AvailabilityInput,
  tz: string = 'America/Sao_Paulo',
  filters?: Filters
): Record<string, string[]> {
  const { availability } = input;
  const now = toZonedTime(new Date(), tz);
  const minAdvanceTime = addHours(now, availability.minAdvanceHours);
  
  const startDate = parseISO(availability.startDate);
  const endDate = parseISO(availability.endDate);
  
  const slots: Record<string, string[]> = {};
  
  // Generate dates from startDate to endDate
  let currentDate = startDate;
  while (!isAfter(currentDate, endDate)) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayName = format(currentDate, 'EEEE') as keyof typeof availability.weekAvailability;
    
    let dayTimes: string[] = [];
    
    // Check if specific date has custom availability
    if (availability.specificDateAvailability?.[dateStr]) {
      dayTimes = availability.specificDateAvailability[dateStr];
    } else if (availability.specificDates?.includes(dateStr)) {
      // Skip dates that are in specificDates but don't have specificDateAvailability
      currentDate = addHours(startOfDay(currentDate), 24);
      continue;
    } else if (availability.holidays?.[dateStr]) {
      dayTimes = availability.holidays[dateStr].times;
    } else {
      dayTimes = availability.weekAvailability[dayName] || [];
    }
    
    // Filter out past times and times within minAdvanceHours
    const availableTimes = dayTimes.filter(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const slotDateTime = fromZonedTime(
        addMinutes(addHours(startOfDay(currentDate), hours), minutes),
        tz
      );
      
      return isAfter(slotDateTime, minAdvanceTime);
    });
    
    // Remove busy events conflicts
    const filteredTimes = availableTimes.filter(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const slotStart = fromZonedTime(
        addMinutes(addHours(startOfDay(currentDate), hours), minutes),
        tz
      );
      const slotEnd = addMinutes(slotStart, availability.eventDurationMinutes);
      
      return !availability.busyEvents.some(busyEvent => {
        const busyStart = parseISO(busyEvent.start);
        const busyEnd = parseISO(busyEvent.end);
        
        // Check for overlap: slot starts before busy ends AND slot ends after busy starts
        return isBefore(slotStart, busyEnd) && isAfter(slotEnd, busyStart);
      });
    });
    
    if (filteredTimes.length > 0) {
      slots[dateStr] = filteredTimes;
    }
    
    currentDate = addHours(startOfDay(currentDate), 24);
  }
  
  // Apply filters if provided
  if (filters) {
    return applyFilters(slots, filters, tz);
  }

  return slots;
}

/**
 * Categorize slots by time type
 */
export function categorizeSlots(
  allSlotsByDate: Record<string, string[]>,
  holidays: Holidays = {}
): Categorized {
  const categorized: Categorized = {
    all: allSlotsByDate,
    afterHours: {},
    saturdays: {},
    sundaysHolidays: {}
  };
  
  Object.entries(allSlotsByDate).forEach(([dateStr, times]) => {
    const date = parseISO(dateStr);
    const dayOfWeek = format(date, 'EEEE');
    
    // After hours (weekdays >= 18:00)
    if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(dayOfWeek)) {
      const afterHoursTimes = times.filter(time => {
        const [hours] = time.split(':').map(Number);
        return hours >= 18;
      });
      if (afterHoursTimes.length > 0) {
        categorized.afterHours[dateStr] = afterHoursTimes;
      }
    }
    
    // Saturdays
    if (dayOfWeek === 'Saturday') {
      categorized.saturdays[dateStr] = times;
    }
    
    // Sundays or Holidays
    if (dayOfWeek === 'Sunday' || holidays[dateStr]) {
      categorized.sundaysHolidays[dateStr] = times;
    }
  });
  
  return categorized;
}

/**
 * Paginate dates within each category
 */
export function paginateDates(
  categorized: Categorized,
  perPage: number = 10,
  page: number = 1
): CategorizedPaged {
  const paginateCategory = (slots: Record<string, string[]>) => {
    const dates = Object.keys(slots).sort();
    const totalPages = Math.ceil(dates.length / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedDates = dates.slice(startIndex, endIndex);
    
    const paginatedSlots: Record<string, string[]> = {};
    paginatedDates.forEach(date => {
      paginatedSlots[date] = slots[date];
    });
    
    return {
      slots: paginatedSlots,
      totalPages,
      currentPage: page
    };
  };
  
  return {
    all: paginateCategory(categorized.all),
    afterHours: paginateCategory(categorized.afterHours),
    saturdays: paginateCategory(categorized.saturdays),
    sundaysHolidays: paginateCategory(categorized.sundaysHolidays)
  };
}

/**
 * Build WhatsApp deep link with formatted message
 */
export function buildWhatsAppDeepLink(
  dateLabel: string,
  dayLabel: string,
  time: string
): string {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5548996425287';
  const message = `Oi, gostaria de agendar o horário do dia ${dateLabel} (${dayLabel}) às ${time}!`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}