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
});
