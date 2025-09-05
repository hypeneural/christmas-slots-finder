export interface Package {
  id: number;
  slug: string;
  name: string;
  durationMinutes: number;
  badges?: string[];
}

export interface BusyEvent {
  start: string; // ISO datetime with timezone
  end: string;   // ISO datetime with timezone
  summary: string;
}

export interface Holidays {
  [date: string]: {
    name: string;
    times: string[];
  };
}

export interface WeekAvailability {
  Monday: string[];
  Tuesday: string[];
  Wednesday: string[];
  Thursday: string[];
  Friday: string[];
  Saturday: string[];
  Sunday: string[];
}

export interface Availability {
  packageId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  minAdvanceHours: number;
  eventDurationMinutes: number;
  specificDates?: string[]; // YYYY-MM-DD dates to include (overrides week rules)
  weekAvailability: WeekAvailability;
  specificDateAvailability?: Record<string, string[]>; // YYYY-MM-DD -> times
  holidays?: Holidays;
  busyEvents: BusyEvent[];
}

export interface AvailabilityData {
  packages: Package[];
  availability: Availability;
}

// Processed data types
export interface Categorized {
  all: Record<string, string[]>;
  afterHours: Record<string, string[]>;
  saturdays: Record<string, string[]>;
  sundaysHolidays: Record<string, string[]>;
}

export interface CategorizedPaged {
  all: {
    slots: Record<string, string[]>;
    totalPages: number;
    currentPage: number;
  };
  afterHours: {
    slots: Record<string, string[]>;
    totalPages: number;
    currentPage: number;
  };
  saturdays: {
    slots: Record<string, string[]>;
    totalPages: number;
    currentPage: number;
  };
  sundaysHolidays: {
    slots: Record<string, string[]>;
    totalPages: number;
    currentPage: number;
  };
}

export type CategoryKey = keyof Categorized;

export interface AvailabilityInput {
  availability: Availability;
  timezone: string;
}