import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

export function WhatsAppFAB() {
  const handleWhatsAppClick = () => {
    const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || 'https://w.fotosdenatal.com/';
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-8 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary shadow-christmas hover:shadow-glow pulse-christmas z-50 bounce-subtle scale-tap border-2 border-background/20"
    >
      <MessageCircle className="w-7 h-7 text-primary-foreground" />
      <span className="sr-only">Contato WhatsApp</span>
    </Button>
  );
}