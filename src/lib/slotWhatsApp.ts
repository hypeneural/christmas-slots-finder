export const SLOTS_WHATSAPP_NUMBER = '5548996425287' as const;

export function buildSlotWhatsAppUrl(message: string): string {
  return `https://wa.me/${SLOTS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
