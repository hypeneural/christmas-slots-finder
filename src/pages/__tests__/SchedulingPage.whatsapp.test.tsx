import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Package } from '../../types';

const SLOTS_NUMBER = '5548996425287';
const LEGACY_NUMBER = '5548998483594';
const CRM_TEMPLATE = 'Olá! Quero agendar {packageName} no dia {date} às {time}.';

const hookState = vi.hoisted(() => ({ packageMeta: null as unknown }));

vi.mock('../../hooks/useInfiniteAvailability', () => ({
  useInfiniteAvailability: () => ({
    categorizedPaged: {
      all: { slots: { '2026-12-15': ['14:00'] }, totalPages: 1, currentPage: 1 },
      afterHours: { slots: {}, totalPages: 1, currentPage: 1 },
      saturdays: { slots: {}, totalPages: 1, currentPage: 1 },
      sundaysHolidays: { slots: {}, totalPages: 1, currentPage: 1 },
    },
    loading: false,
    loadingMore: false,
    error: null,
    packageMeta: hookState.packageMeta,
    availableFilters: null,
    loadMore: vi.fn(),
    hasNextPage: false,
    currentPage: 1,
    totalPages: 1,
  }),
}));

// Simplifica apenas a lista de datas: o foco e o fluxo de WhatsApp da pagina.
vi.mock('../../components/DateAccordion', () => ({
  DateAccordion: ({ slots, onSlotClick }: { slots: Record<string, string[]>; onSlotClick: (d: string, t: string) => void }) => (
    <div>
      {Object.entries(slots).flatMap(([date, times]) =>
        times.map((time) => (
          <button key={`${date}-${time}`} onClick={() => onSlotClick(date, time)}>
            {`slot ${date} ${time}`}
          </button>
        )),
      )}
    </div>
  ),
}));

import SchedulingPage from '../SchedulingPage';

// O CRM ainda envia o numero antigo em cada pacote: ele nao pode vencer o destino fixo.
const hostileCta = {
  mode: 'whatsapp',
  whatsappNumber: LEGACY_NUMBER,
  whatsappMessageTemplate: CRM_TEMPLATE,
  paymentUrl: 'https://evydencia.com/catalogo/natal',
};

const packages: Package[] = [
  { id: 1, slug: 'entao-e-natal', name: 'Experiência Então é Natal', durationMinutes: 30, cta: hostileCta, customerFlow: { mode: 'lead' } },
  { id: 2, slug: 'ho-ho-ho', name: 'Experiência Ho-Ho-Ho', durationMinutes: 30, cta: hostileCta, customerFlow: { mode: 'lead' } },
  { id: 3, slug: 'boas-festas', name: 'Experiência Boas Festas', durationMinutes: 30, cta: hostileCta, customerFlow: { mode: 'lead' } },
];

function renderPage(pkg: Package) {
  hookState.packageMeta = pkg;
  return render(
    <MemoryRouter initialEntries={[`/agendar/${pkg.slug}`]}>
      <Routes>
        <Route path="/agendar/:packageSlug" element={<SchedulingPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function lastOpenedUrl(openSpy: ReturnType<typeof vi.fn>): string {
  const calls = openSpy.mock.calls;
  return String(calls[calls.length - 1][0]);
}

function expectSlotLink(url: string, pkg: Package) {
  expect(url.startsWith(`https://wa.me/${SLOTS_NUMBER}?text=`)).toBe(true);
  expect(url).not.toContain(LEGACY_NUMBER);
  const message = decodeURIComponent(url.split('?text=')[1]);
  expect(message).toContain(pkg.name);
  expect(message).toContain('15/12');
  expect(message).toContain('14:00');
  expect(url.split('?text=')[1]).toBe(encodeURIComponent(message));
}

describe('SchedulingPage - WhatsApp dos horarios', () => {
  let openSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    openSpy = vi.fn();
    vi.stubGlobal('open', openSpy);
    vi.stubEnv('VITE_WHATSAPP_NUMBER', LEGACY_NUMBER);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe.each(packages)('$name', (pkg) => {
    it('fluxo "Ja paguei" abre o WhatsApp fixo com pacote, data e horario', async () => {
      renderPage(pkg);

      fireEvent.click(screen.getByText('slot 2026-12-15 14:00'));
      fireEvent.click(await screen.findByLabelText('Já paguei - Abrir WhatsApp'));

      await waitFor(() => expect(openSpy).toHaveBeenCalledTimes(1));
      expectSlotLink(lastOpenedUrl(openSpy), pkg);
    });

    it('fluxo "Falar no WhatsApp" abre o WhatsApp fixo com pacote, data e horario', async () => {
      renderPage(pkg);

      fireEvent.click(screen.getByText('slot 2026-12-15 14:00'));
      fireEvent.click(await screen.findByLabelText('Quero pagar agora'));
      fireEvent.click(await screen.findByLabelText('Falar no WhatsApp'));

      await waitFor(() => expect(openSpy).toHaveBeenCalledTimes(1));
      expectSlotLink(lastOpenedUrl(openSpy), pkg);
    });
  });

  it('inclui o dia da semana quando o template padrao e usado', async () => {
    const pkg: Package = { ...packages[1], cta: { ...hostileCta, whatsappMessageTemplate: undefined } };
    renderPage(pkg);

    fireEvent.click(screen.getByText('slot 2026-12-15 14:00'));
    fireEvent.click(await screen.findByLabelText('Já paguei - Abrir WhatsApp'));

    await waitFor(() => expect(openSpy).toHaveBeenCalledTimes(1));
    const url = lastOpenedUrl(openSpy);
    expect(url.startsWith(`https://wa.me/${SLOTS_NUMBER}?text=`)).toBe(true);
    expect(decodeURIComponent(url.split('?text=')[1])).toMatch(/terça-feira/i);
  });
});
