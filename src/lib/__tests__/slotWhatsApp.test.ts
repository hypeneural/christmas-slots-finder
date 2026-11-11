import { describe, expect, it } from 'vitest';
import { SLOTS_WHATSAPP_NUMBER, buildSlotWhatsAppUrl } from '../slotWhatsApp';

describe('slotWhatsApp', () => {
  it('usa sempre o numero fixo dos horarios', () => {
    expect(SLOTS_WHATSAPP_NUMBER).toBe('5548996425287');
    expect(buildSlotWhatsAppUrl('oi').startsWith('https://wa.me/5548996425287?text=')).toBe(true);
  });

  it('codifica a mensagem com encodeURIComponent', () => {
    const message = 'Olá! Quero agendar Experiência Ho-Ho-Ho no dia 15/12 às 14:00 & mais? #1\n🎄';
    const url = buildSlotWhatsAppUrl(message);

    expect(url).toBe(`https://wa.me/5548996425287?text=${encodeURIComponent(message)}`);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(message);
  });
});
