import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SimpleFiltersModal } from '../SimpleFiltersModal';

describe('SimpleFiltersModal', () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, 'vibrate', {
      configurable: true,
      value: vi.fn(),
    });
  });

  it('abre o modal de filtros sem erro de data fora de escopo', () => {
    expect(() => render(
      <SimpleFiltersModal
        open
        onOpenChange={vi.fn()}
        filters={{}}
        onApplyFilters={vi.fn()}
        onClearFilters={vi.fn()}
      />
    )).not.toThrow();

    expect(screen.getAllByText('Filtros Avançados').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Selecionar período')).toBeInTheDocument();
    expect(screen.getByLabelText('Data inicial')).toHaveAttribute('min');
    expect(screen.getByLabelText('Data final')).toHaveAttribute('min');
  });

  it('renderiza filtros dinamicos vindos da API publica', () => {
    render(
      <SimpleFiltersModal
        open
        onOpenChange={vi.fn()}
        filters={{}}
        availableFilters={{
          daysOfWeek: ['Sat'],
          daysOfWeekOptions: [{ value: 'Sat', label: 'Sábado' }],
          timePeriods: ['morning', 'after18'],
          timePeriodOptions: [
            { value: 'morning', label: 'Manhã' },
            { value: 'after18', label: 'Após horário comercial' },
          ],
          times: ['09:00', '18:00'],
          holidayDates: ['2026-10-03'],
          hasHolidays: true,
          hasAfterHours: true,
        }}
        onApplyFilters={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    expect(screen.getByText('Somente feriados e datas especiais')).toBeInTheDocument();
    expect(screen.getByLabelText('Sábado')).toBeInTheDocument();
    expect(screen.getByLabelText('Escolher uma data especial')).toBeInTheDocument();
  });
});
