import { z } from 'zod';

// ============================================================================
// TYPES - Request (front/back)
// ============================================================================

export type DayCode =
  | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export type PeriodCode = "morning" | "afternoon" | "evening";

export interface QueryFilters {
  tz?: string;
  page?: number;
  perPage?: number;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;   // YYYY-MM-DD
  daysOfWeek?: DayCode[];      // no GET vira CSV
  onlyWeekends?: boolean;
  timeOfDay?: PeriodCode[];    // no GET vira CSV
  timeStart?: string;          // HH:MM
  timeEnd?: string;            // HH:MM
  onlyAfter18?: boolean;
  exactTime?: string | null;   // HH:MM
  minSlotsPerDate?: number;
}

export interface PostBody {
  filters?: {
    request?: {
      packageSlug?: "HOHOHO" | "ENTAO" | "BOAS";
      applied?: {
        dateRange?: { from?: string; to?: string; timezone?: string };
        daysOfWeek?: { enabled?: boolean; days?: DayCode[]; shortcuts?: { onlyWeekends?: boolean; onlyWeekdays?: boolean } };
        timeRange?: {
          enabled?: boolean;
          type?: "custom" | "preset" | "periods";
          start?: string | null;
          end?: string | null;
          periods?: PeriodCode[];
          shortcuts?: { onlyAfter18?: boolean; businessHours?: boolean };
        };
        availability?: { minSlotsPerDate?: number; maxSlotsPerDate?: number | null; exactTime?: string | null };
      };
      pagination?: { page?: number; perPage?: number; offset?: number };
      metadata?: Record<string, unknown>;
    };
  };
}

// ============================================================================
// TYPES - Response (espelhar exatamente o backend)
// ============================================================================

export type IsoDate = string;     // "YYYY-MM-DD"
export type IsoDateTime = string; // ISO-8601
export type HhMm = string;        // "HH:MM"

export interface ApiSuccess {
  success: true;
  timestamp: IsoDateTime;
  package: {
    id: number;
    code: "HOHOHO" | "ENTAO" | "BOAS";
    name: string;
    durationMinutes: number;
    bufferMinutes: number;
    url: string | null;
  };
  availability: {
    period: { startDate: IsoDate; endDate: IsoDate; timezone: string };
    rulesUsed: Array<{ id: number; name: string; startDate: IsoDate; endDate: IsoDate }>;
  };
  processedSlots: {
    all: Record<IsoDate, HhMm[]>;
    afterHours: Record<IsoDate, HhMm[]>;
    saturdays: Record<IsoDate, HhMm[]>;
    sundaysHolidays: Record<IsoDate, HhMm[]>;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    totalDays: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    available: {
      dateRange: { min: IsoDate; max: IsoDate };
      daysOfWeek: Array<{ code: DayCode; label: string; short: string; enabled: boolean; slotCount: number }>;
      timePeriods: Array<{ code: PeriodCode; label: string; range: [HhMm, HhMm]; slotCount: number }>;
      shortcuts: {
        onlyWeekends: { enabled: boolean; slotCount: number };
        onlyWeekdays: { enabled: boolean; slotCount: number };
        onlyAfter18: { enabled: boolean; slotCount: number };
        businessHours: { enabled: boolean; slotCount: number };
      };
    };
    applied: {
      dateRange: { from: IsoDate; to: IsoDate };
      daysOfWeek: DayCode[];
      timeRange: { start: HhMm | null; end: HhMm | null };
      periods: PeriodCode[];
      onlyWeekends: boolean;
      onlyAfter18: boolean;
      exactTime: HhMm | null;
      minSlotsPerDate: number;
    };
  };
  googleCalendar: {
    ignoredEvents: Array<{ id: string; summary: string; start: string | null; end: string | null }>;
    hasError: boolean;
    error: string | null;
  };
  metadata: {
    generatedAt: IsoDateTime;
    version: string;
    source: string;
    blockWithBuffer: boolean;
  };
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse = ApiSuccess | ApiError;

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

const DayCodeSchema = z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
const PeriodCodeSchema = z.enum(["morning", "afternoon", "evening"]);
const IsoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const IsoDateTimeSchema = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  { message: "Invalid datetime format" }
);
const HhMmSchema = z.string().regex(/^\d{2}:\d{2}$/);

const ApiSuccessSchema = z.object({
  success: z.literal(true),
  timestamp: IsoDateTimeSchema,
  package: z.object({
    id: z.number(),
    code: z.enum(["HOHOHO", "ENTAO", "BOAS"]),
    name: z.string(),
    durationMinutes: z.number(),
    bufferMinutes: z.number(),
    url: z.string().nullable(),
  }),
  availability: z.object({
    period: z.object({
      startDate: IsoDateSchema,
      endDate: IsoDateSchema,
      timezone: z.string(),
    }),
    rulesUsed: z.array(z.object({
      id: z.number(),
      name: z.string(),
      startDate: IsoDateSchema,
      endDate: IsoDateSchema,
    })),
  }),
  processedSlots: z.object({
    all: z.union([
      z.record(IsoDateSchema, z.array(HhMmSchema)),
      z.array(z.never()).transform(() => ({}))
    ]),
    afterHours: z.union([
      z.record(IsoDateSchema, z.array(HhMmSchema)),
      z.array(z.never()).transform(() => ({}))
    ]),
    saturdays: z.union([
      z.record(IsoDateSchema, z.array(HhMmSchema)),
      z.array(z.never()).transform(() => ({}))
    ]),
    sundaysHolidays: z.union([
      z.record(IsoDateSchema, z.array(HhMmSchema)),
      z.array(z.never()).transform(() => ({}))
    ]),
  }),
  pagination: z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    perPage: z.number(),
    totalDays: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  }),
  filters: z.object({
    available: z.object({
      dateRange: z.object({
        min: IsoDateSchema,
        max: IsoDateSchema,
      }),
      daysOfWeek: z.array(z.object({
        code: DayCodeSchema,
        label: z.string(),
        short: z.string(),
        enabled: z.boolean(),
        slotCount: z.number(),
      })),
      timePeriods: z.array(z.object({
        code: PeriodCodeSchema,
        label: z.string(),
        range: z.tuple([HhMmSchema, HhMmSchema]),
        slotCount: z.number(),
      })),
      shortcuts: z.object({
        onlyWeekends: z.object({ enabled: z.boolean(), slotCount: z.number() }),
        onlyWeekdays: z.object({ enabled: z.boolean(), slotCount: z.number() }),
        onlyAfter18: z.object({ enabled: z.boolean(), slotCount: z.number() }),
        businessHours: z.object({ enabled: z.boolean(), slotCount: z.number() }),
      }),
    }),
    applied: z.object({
      dateRange: z.object({
        from: IsoDateSchema,
        to: IsoDateSchema,
      }),
      daysOfWeek: z.array(DayCodeSchema),
      timeRange: z.object({
        start: HhMmSchema.nullable(),
        end: HhMmSchema.nullable(),
      }),
      periods: z.array(PeriodCodeSchema),
      onlyWeekends: z.boolean(),
      onlyAfter18: z.boolean(),
      exactTime: HhMmSchema.nullable(),
      minSlotsPerDate: z.number(),
    }),
  }),
  googleCalendar: z.object({
    ignoredEvents: z.array(z.object({
      id: z.string(),
      summary: z.string(),
      start: z.string().nullable(),
      end: z.string().nullable(),
    })),
    hasError: z.boolean(),
    error: z.string().nullable(),
  }),
  metadata: z.object({
    generatedAt: IsoDateTimeSchema,
    version: z.string(),
    source: z.string(),
    blockWithBuffer: z.boolean(),
  }),
});

const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const ApiResponseSchema = z.discriminatedUnion("success", [
  ApiSuccessSchema,
  ApiErrorSchema,
]);

// ============================================================================
// CLIENT OPTIONS
// ============================================================================

export interface AvailabilityClientOptions {
  baseUrl?: string; // default: "https://horarios.fotosdenatal.com/app.php"
  timeoutMs?: number; // default: 15000
  defaultTZ?: string; // default: "America/Sao_Paulo"
}

// ============================================================================
// AVAILABILITY CLIENT
// ============================================================================

export class AvailabilityClient {
  private baseUrl: string;
  private timeoutMs: number;
  private defaultTZ: string;

  constructor(options: AvailabilityClientOptions = {}) {
    this.baseUrl = options.baseUrl || "https://horarios.fotosdenatal.com/app.php";
    this.timeoutMs = options.timeoutMs || 15000;
    this.defaultTZ = options.defaultTZ || "America/Sao_Paulo";
  }

  /**
   * Converte arrays para CSV conforme especificação da API
   */
  private arrayToCsv<T>(arr: T[]): string {
    return arr.join(',');
  }

  /**
   * Constrói query params a partir dos filtros
   */
  buildQueryFromFilters(filters?: QueryFilters): URLSearchParams {
    const params = new URLSearchParams();
    
    if (!filters) return params;

    // Timezone
    if (filters.tz) {
      params.set('tz', filters.tz);
    }

    // Paginação
    if (filters.page !== undefined) {
      params.set('page', filters.page.toString());
    }
    if (filters.perPage !== undefined) {
      params.set('perPage', filters.perPage.toString());
    }

    // Range de datas
    if (filters.dateFrom) {
      params.set('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params.set('dateTo', filters.dateTo);
    }

    // Dias da semana
    if (filters.daysOfWeek && filters.daysOfWeek.length > 0) {
      params.set('daysOfWeek', this.arrayToCsv(filters.daysOfWeek));
    }
    if (filters.onlyWeekends !== undefined) {
      params.set('onlyWeekends', filters.onlyWeekends.toString());
    }

    // Períodos do dia
    if (filters.timeOfDay && filters.timeOfDay.length > 0) {
      params.set('timeOfDay', this.arrayToCsv(filters.timeOfDay));
    }

    // Range de horário customizado
    if (filters.timeStart) {
      params.set('timeStart', filters.timeStart);
    }
    if (filters.timeEnd) {
      params.set('timeEnd', filters.timeEnd);
    }

    // Atalhos
    if (filters.onlyAfter18 !== undefined) {
      params.set('onlyAfter18', filters.onlyAfter18.toString());
    }

    // Horário exato
    if (filters.exactTime) {
      params.set('exactTime', filters.exactTime);
    }

    // Mínimo de slots por data
    if (filters.minSlotsPerDate !== undefined) {
      params.set('minSlotsPerDate', filters.minSlotsPerDate.toString());
    }

    return params;
  }

  /**
   * Valida e processa resposta da API
   */
  private async processResponse(response: Response): Promise<ApiSuccess> {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const result = ApiResponseSchema.safeParse(data);

    if (!result.success) {
      throw new Error(`Invalid API response: ${JSON.stringify(result.error)}`);
    }

    if (!result.data.success) {
      throw new Error(`API Error: ${(result.data as ApiError).error}`);
    }

    return result.data as ApiSuccess;
  }

  /**
   * Executa requisição com timeout e abort signal
   */
  private async makeRequest(
    url: string,
    init: RequestInit & { signal?: AbortSignal } = {}
  ): Promise<ApiSuccess> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    // Merge signals se ambos existirem
    const signal = init.signal 
      ? this.mergeAbortSignals(controller.signal, init.signal)
      : controller.signal;

    try {
      const response = await fetch(url, {
        ...init,
        signal,
      });
      
      clearTimeout(timeoutId);
      return await this.processResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeoutMs}ms`);
      }
      
      throw error;
    }
  }

  /**
   * Combina dois AbortSignals
   */
  private mergeAbortSignals(signal1: AbortSignal, signal2: AbortSignal): AbortSignal {
    const controller = new AbortController();
    
    const abort = () => controller.abort();
    signal1.addEventListener('abort', abort);
    signal2.addEventListener('abort', abort);
    
    return controller.signal;
  }

  /**
   * GET - Busca disponibilidade via query params
   */
  async getAvailability(
    pack: "HOHOHO" | "ENTAO" | "BOAS" | number,
    filters?: QueryFilters,
    init?: RequestInit & { signal?: AbortSignal }
  ): Promise<ApiSuccess> {
    const queryParams = this.buildQueryFromFilters(filters);
    queryParams.set('pack', pack.toString());
    
    const url = `${this.baseUrl}?${queryParams.toString()}`;
    
    return this.makeRequest(url, init);
  }

  /**
   * POST - Busca disponibilidade via body JSON
   */
  async postAvailability(
    pack: "HOHOHO" | "ENTAO" | "BOAS" | number,
    body?: PostBody,
    init?: RequestInit & { signal?: AbortSignal }
  ): Promise<ApiSuccess> {
    const queryParams = new URLSearchParams();
    queryParams.set('pack', pack.toString());
    
    const url = `${this.baseUrl}?${queryParams.toString()}`;
    
    return this.makeRequest(url, {
      ...init,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Pagina todas as datas disponíveis até esgotar
   */
  async* paginateAllDates(
    pack: "HOHOHO" | "ENTAO" | "BOAS" | number,
    filters?: QueryFilters
  ): AsyncGenerator<ApiSuccess, void, unknown> {
    let currentPage = filters?.page || 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const pageFilters = { ...filters, page: currentPage };
      const result = await this.getAvailability(pack, pageFilters);
      
      yield result;
      
      hasNextPage = result.pagination.hasNextPage;
      currentPage++;
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Verifica se uma resposta é um erro da API
 */
export function isApiError(response: ApiResponse): response is ApiError {
  return !response.success;
}

/**
 * Assert que a resposta é sucesso, senão lança erro
 */
export function assertSuccess(response: ApiResponse): asserts response is ApiSuccess {
  if (!response.success) {
    throw new Error(`API Error: ${(response as ApiError).error}`);
  }
}

// ============================================================================
// DEFAULT CLIENT INSTANCE
// ============================================================================

export const availabilityClient = new AvailabilityClient();
