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
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-christmas pulse-christmas z-50"
      size="icon"
    >
      <MessageCircle className="w-6 h-6 text-primary-foreground" />
      <span className="sr-only">Contato WhatsApp</span>
    </Button>
  );
}