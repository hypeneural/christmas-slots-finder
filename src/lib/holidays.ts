import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Feriados brasileiros para 2025
const BRAZILIAN_HOLIDAYS_2025 = {
  '2025-10-12': 'Nossa Sr.a Aparecida - Padroeira do Brasil',
  '2025-11-02': 'Finados',
  '2025-11-15': 'Proclamação da República',
  '2025-11-20': 'Dia Nacional de Zumbi e da Consciência Negra',
};

// Feriados móveis (calculados dinamicamente)
const calculateEaster = (year: number): Date => {
  // Algoritmo de Gauss para calcular a Páscoa
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = Math.floor((h + l - 7 * m + 114) / 31);
  const p = (h + l - 7 * m + 114) % 31;
  
  return new Date(year, n - 1, p + 1);
};

const calculateHolidaysFromEaster = (year: number) => {
  const easter = calculateEaster(year);
  const holidays: Record<string, string> = {};
  
  // Carnaval (47 dias antes da Páscoa)
  const carnival = new Date(easter);
  carnival.setDate(easter.getDate() - 47);
  holidays[format(carnival, 'yyyy-MM-dd')] = 'Carnaval';
  
  // Sexta-feira Santa (2 dias antes da Páscoa)
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  holidays[format(goodFriday, 'yyyy-MM-dd')] = 'Sexta-feira Santa';
  
  // Corpus Christi (60 dias depois da Páscoa)
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);
  holidays[format(corpusChristi, 'yyyy-MM-dd')] = 'Corpus Christi';
  
  return holidays;
};

// Feriados fixos por ano
const getFixedHolidays = (year: number): Record<string, string> => {
  const holidays: Record<string, string> = {};
  
  // Feriados nacionais fixos
  holidays[`${year}-01-01`] = 'Confraternização Universal';
  holidays[`${year}-04-21`] = 'Tiradentes';
  holidays[`${year}-05-01`] = 'Dia do Trabalhador';
  holidays[`${year}-09-07`] = 'Independência do Brasil';
  holidays[`${year}-10-12`] = 'Nossa Sr.a Aparecida - Padroeira do Brasil';
  holidays[`${year}-11-02`] = 'Finados';
  holidays[`${year}-11-15`] = 'Proclamação da República';
  holidays[`${year}-11-20`] = 'Dia Nacional de Zumbi e da Consciência Negra';
  holidays[`${year}-12-25`] = 'Natal';
  
  return holidays;
};

/**
 * Verifica se uma data é feriado no Brasil
 * @param date - Data no formato ISO string (YYYY-MM-DD) ou objeto Date
 * @returns Nome do feriado ou null se não for feriado
 */
export const isHoliday = (date: string | Date): string | null => {
  let dateStr: string;
  
  if (typeof date === 'string') {
    dateStr = date;
  } else {
    dateStr = date.toISOString().slice(0, 10);
  }
  
  // Extrair o ano da data
  const year = parseInt(dateStr.split('-')[0]);
  
  // Combinar feriados fixos e móveis
  const fixedHolidays = getFixedHolidays(year);
  const mobileHolidays = calculateHolidaysFromEaster(year);
  const allHolidays = { ...fixedHolidays, ...mobileHolidays };
  
  return allHolidays[dateStr] || null;
};

/**
 * Obtém informações sobre feriado para uma data
 * @param date - Data no formato ISO string (YYYY-MM-DD) ou objeto Date
 * @returns Objeto com informações do feriado ou null
 */
export const getHolidayInfo = (date: string | Date) => {
  const holidayName = isHoliday(date);
  
  if (!holidayName) {
    return null;
  }
  
  return {
    name: holidayName,
    isNational: true, // Todos os feriados listados são nacionais
    isFixed: !holidayName.includes('Carnaval') && 
             !holidayName.includes('Sexta-feira Santa') && 
             !holidayName.includes('Corpus Christi')
  };
};

/**
 * Formata a data para exibição com informação de feriado
 * @param date - Data no formato ISO string (YYYY-MM-DD) ou objeto Date
 * @returns Objeto com data formatada e informação de feriado
 */
export const formatDateWithHoliday = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const dateLabel = format(parsedDate, 'dd/MM', { locale: ptBR });
  const dayLabel = format(parsedDate, 'EEEE', { locale: ptBR });
  const holidayInfo = getHolidayInfo(date);
  
  return {
    dateLabel,
    dayLabel,
    holidayInfo
  };
};
