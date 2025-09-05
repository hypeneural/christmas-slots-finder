import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CreditCard, MessageCircle, Timer } from 'lucide-react';
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
      <DialogContent className="sm:max-w-md mx-4 bg-card border-border">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-foreground">
            {i18n.paymentTitle}
          </DialogTitle>
          
          {timerActive && (
            <div className="flex items-center justify-center gap-2 py-2 text-accent">
              <Timer className="w-4 h-4" />
              <span className="text-sm font-medium">
                {i18n.redirectingIn(countdown)}
              </span>
            </div>
          )}
          
          <DialogDescription className="text-center text-foreground leading-relaxed">
            {i18n.paymentMessage}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-col">
          <Button
            onClick={handlePayNow}
            className="w-full touch-target bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground font-bold shadow-glow hover:shadow-christmas"
            size="lg"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {i18n.payNow}
          </Button>
          
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            className="w-full touch-target border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            size="lg"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {i18n.whatsappContact}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}