import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CreditCard, MessageCircle, Timer, AlertCircle } from 'lucide-react';
import { i18n } from '../lib/i18n';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDialog({ open, onOpenChange }: PaymentDialogProps) {
  const [countdown, setCountdown] = useState(10);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (open) {
      setCountdown(10);
      setTimerActive(true);
    }
  }, [open]);

  useEffect(() => {
    if (!timerActive || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          // Auto redirect to payment
          handlePayNow();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, timerActive]);

  const handlePayNow = () => {
    setTimerActive(false);
    const paymentUrl = import.meta.env.VITE_PAYMENT_URL || 'https://evydencia.com/catalogo/natal';
    window.open(paymentUrl, '_blank');
    onOpenChange(false);
  };

  const handleWhatsApp = () => {
    setTimerActive(false);
    const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || 'https://w.fotosdenatal.com/';
    window.open(whatsappUrl, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) setTimerActive(false);
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md mx-4 app-card border-border/50 animate-scale-in shadow-2xl backdrop-blur-sm">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto p-4 rounded-full bg-gradient-to-br from-accent/30 to-yellow-400/30 shadow-glow pulse-christmas">
            <CreditCard className="w-8 h-8 text-accent animate-pulse" />
          </div>
          
          <DialogTitle className="text-2xl font-bold text-foreground">
            {i18n.paymentTitle}
          </DialogTitle>
          
          {timerActive && (
            <div className="flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-xl border-2 border-accent/30 shadow-inner animate-pulse">
              <div className="p-1.5 rounded-full bg-accent/30">
                <Timer className="w-5 h-5 text-accent animate-spin" />
              </div>
              <span className="text-lg font-bold text-accent animate-bounce">
                ⏰ {i18n.redirectingIn(countdown)}
              </span>
            </div>
          )}
          
          <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <DialogDescription className="text-left text-foreground leading-relaxed text-base">
              {i18n.paymentMessage}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col gap-4 sm:flex-col mt-6">
          <Button
            onClick={handlePayNow}
            className="w-full touch-large bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground font-bold shadow-glow hover:shadow-christmas scale-tap pulse-christmas relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CreditCard className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">💳 {i18n.payNow}</span>
          </Button>
          
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            className="w-full touch-large border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-bold scale-tap shadow-button hover:shadow-glow hover:border-primary transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            💬 {i18n.whatsappContact}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}