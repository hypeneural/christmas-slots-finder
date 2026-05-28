import { isHoliday, getHolidayInfo, formatDateWithHoliday } from '../holidays';

describe('Holidays', () => {
  describe('isHoliday', () => {
    it('should identify Brazilian holidays correctly', () => {
      // Feriados fixos de 2025
      expect(isHoliday('2025-10-12')).toBe('Nossa Senhora Aparecida');
      expect(isHoliday('2025-11-02')).toBe('Finados');
      expect(isHoliday('2025-11-15')).toBe('Proclamação da República');
      expect(isHoliday('2025-11-20')).toBe('Dia Nacional de Zumbi e da Consciência Negra');
      expect(isHoliday('2025-01-01')).toBe('Confraternização Universal');
      expect(isHoliday('2025-12-25')).toBe('Natal');
    });

    it('should return null for non-holidays', () => {
      expect(isHoliday('2025-10-13')).toBeNull();
      expect(isHoliday('2025-11-01')).toBeNull();
      expect(isHoliday('2025-11-16')).toBeNull();
    });

    it('should work with Date objects', () => {
      const holidayDate = new Date('2025-10-12');
      expect(isHoliday(holidayDate)).toBe('Nossa Senhora Aparecida');
    });
  });

  describe('getHolidayInfo', () => {
    it('should return holiday information for holidays', () => {
      const info = getHolidayInfo('2025-10-12');
      expect(info).toEqual({
        name: 'Nossa Senhora Aparecida',
        isNational: true,
        isFixed: true
      });
    });

    it('should return null for non-holidays', () => {
      expect(getHolidayInfo('2025-10-13')).toBeNull();
    });
  });

  describe('formatDateWithHoliday', () => {
    it('should format date with holiday information', () => {
      const result = formatDateWithHoliday('2025-10-12');
      expect(result.dateLabel).toBe('12/10');
      expect(result.dayLabel).toBe('domingo');
      expect(result.holidayInfo).toEqual({
        name: 'Nossa Senhora Aparecida',
        isNational: true,
        isFixed: true
      });
    });

    it('should format date without holiday information', () => {
      const result = formatDateWithHoliday('2025-10-13');
      expect(result.dateLabel).toBe('13/10');
      expect(result.dayLabel).toBe('segunda-feira');
      expect(result.holidayInfo).toBeNull();
    });
  });
});
