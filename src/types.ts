// Mobile-first filter types
export type DayCode = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'after18';
export type CategoryKey = 'all' | 'afterHours' | 'saturdays' | 'sundaysHolidays';

export interface Package {
  id: number;
  slug: string;
  name: string;
  durationMinutes: number;
  badges?: string[];
  subtitle?: string | null;
  description?: string | null;
  durationLabel?: string | null;
  availabilityLabel?: string | null;
  isFeatured?: boolean;
  cta?: PackageCta;
  customerFlow?: CustomerFlow;
}

export interface PackageCta {
  mode?: string;
  label?: string;
  whatsappNumber?: string;
  whatsappUrl?: string;
  whatsappMessageTemplate?: string;
  paymentUrl?: string;
}

export interface CustomerFlow {
  mode?: string;
  ctaMode?: string;
}

export interface Holiday { 
  name: string; 
  times: string[]; 
}
export type Holidays = Record<string, Holiday>;

export interface BusyEvent {
  start: string; // ISO datetime with timezone
  end: string;   // ISO datetime with timezone
  summary?: string;
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
  busyEvents?: BusyEvent[];
}

export interface AvailabilityData {
  packages: Package[];
  availability: Availability;
}

export interface AvailabilityInput {
  packages: Package[];
  availability: Availability;
}

// Mobile filters interface
export interface Filters {
  dateFrom?: string;          // YYYY-MM-DD
  dateTo?: string;            // YYYY-MM-DD
  daysOfWeek?: DayCode[];     // multi-select
  onlyWeekends?: boolean;
  onlyHolidays?: boolean;
  timeOfDay?: TimeOfDay[];    // ['morning','after18'] etc.
  timeRange?: [string, string]; // ['HH:mm','HH:mm']
  onlyAfter18?: boolean;      // atalho
  exactTime?: string;         // HH:mm
  minSlotsPerDate?: number;   // ex.: 2
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

// Mobile UI types
export type HapticKind = 'light' | 'medium' | 'heavy' | 'success' | 'warning';

export interface UIFlags {
  safeAreaTop: number;    // em px — lidos de CSS env() quando disponível
  safeAreaBottom: number; // em px
  sheetOpen: boolean;
  haptic?: HapticKind;    // dispara vibrate curto ao mudar
}

export interface RouteParams {
  packageSlug?: string;
  page?: number;          // via query param
}

export interface FiltersURLState {
  df?: string; dt?: string;      // dateFrom/dateTo
  dow?: string;                  // 'mon,tue,wed'
  wknd?: '0'|'1';
  tod?: string;                  // 'morning,after18'
  tr?: string;                   // '08:00-12:00'
  a18?: '0'|'1';
  xt?: string;                   // exact time
  min?: string;                  // number
}
