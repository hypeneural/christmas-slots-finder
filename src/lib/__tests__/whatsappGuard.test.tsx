import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { WhatsAppFAB } from '../../components/WhatsAppFAB';

const SRC_DIR = join(process.cwd(), 'src');
const LEGACY_NUMBER = '5548998483594';

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' ? [] : listSourceFiles(full);
    }
    return /\.(ts|tsx)$/.test(entry) ? [full] : [];
  });
}

const sources = listSourceFiles(SRC_DIR).map((file) => ({
  path: relative(SRC_DIR, file).split(sep).join('/'),
  content: readFileSync(file, 'utf8'),
}));

describe('guarda do WhatsApp dos horarios', () => {
  it('nao deixa numero antigo nem VITE_WHATSAPP_NUMBER no codigo de producao', () => {
    const offenders = sources.filter(
      ({ content }) => content.includes(LEGACY_NUMBER) || content.includes('VITE_WHATSAPP_NUMBER'),
    );
    expect(offenders.map((f) => f.path)).toEqual([]);
  });

  it('monta links wa.me somente em slotWhatsApp.ts', () => {
    const builders = sources.filter(({ content }) => content.includes('wa.me/'));
    expect(builders.map((f) => f.path)).toEqual(['lib/slotWhatsApp.ts']);
  });

  it('modal de pagamento nao aceita mais whatsappNumber', () => {
    const modal = sources.find((f) => f.path === 'components/OptimizedPaymentModal.tsx');
    expect(modal?.content).not.toMatch(/whatsappNumber/);
  });
});

describe('botoes gerais de contato', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('WhatsAppFAB continua abrindo VITE_WHATSAPP_URL', () => {
    const openSpy = vi.fn();
    vi.stubGlobal('open', openSpy);
    vi.stubEnv('VITE_WHATSAPP_URL', 'https://contato.example/geral');

    render(<WhatsAppFAB />);
    fireEvent.click(screen.getByRole('button'));

    expect(openSpy).toHaveBeenCalledWith('https://contato.example/geral', '_blank');
  });

  it('demais botoes gerais seguem usando VITE_WHATSAPP_URL', () => {
    for (const path of [
      'components/PaymentDialog.tsx',
      'components/TouchFriendlyPaymentModal.tsx',
      'components/TouchFriendlyPaymentModalOptimized.tsx',
      'pages/PackageSelection.tsx',
    ]) {
      const file = sources.find((f) => f.path === path);
      expect(file?.content, path).toContain('VITE_WHATSAPP_URL');
      expect(file?.content, path).not.toContain('slotWhatsApp');
    }
  });
});
