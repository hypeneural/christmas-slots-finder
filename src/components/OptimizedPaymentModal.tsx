import * as React from 'react';
import { Drawer } from 'vaul';
import { X, Calendar, Clock, CreditCard, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DragIndicator } from './DragIndicator';
import { VisuallyHidden } from './VisuallyHidden';
import { useOptimizedTimer } from '@/hooks/useOptimizedTimer';
import { i18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { memo, useCallback, useEffect, useState } from 'react';

interface OptimizedPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateLabel: string;
  dayLabel: string;
  time: string;
  packageName?: string;
  paymentUrl?: string;
  whatsappNumber?: string;
  whatsappMessageTemplate?: string;
}

const OptimizedPaymentModalComponent = ({
  open,
  onOpenChange,
  dateLabel,
  dayLabel,
  time,
  packageName,
  paymentUrl,
  whatsappNumber,
  whatsappMessageTemplate
}: OptimizedPaymentModalProps) => {
  const [timerActive, setTimerActive] = useState(false);

  // Memoize handlers to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handlePayNow = useCallback(() => {
    setTimerActive(false);
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      setTimeout(() => {
        const url = paymentUrl || import.meta.env.VITE_PAYMENT_URL || 'https://evydencia.com/catalogo/natal';
        window.open(url, '_blank');
      }, 0);
    });
  }, [paymentUrl]);

  const handleWhatsApp = useCallback(() => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      setTimeout(() => {
        const message = (whatsappMessageTemplate || 'Olá! Quero agendar {packageName} no dia {date} ({dayLabel}) às {time}.')
          .replace('{packageName}', packageName || 'minha sessão de Natal')
          .replace('{date}', dateLabel)
          .replace('{dayLabel}', dayLabel)
          .replace('{time}', time);
        const phone = whatsappNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '5548998483594';
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }, 0);
    });
  }, [dateLabel, dayLabel, packageName, time, whatsappMessageTemplate, whatsappNumber]);

  // Timer effect
  useEffect(() => {
    if (open) {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [open]);

  const { time: countdown, isActive } = useOptimizedTimer({
    initialTime: 10,
    onComplete: handlePayNow,
    active: timerActive
  });

  if (!open) return null;

  return (
    <Drawer.Root open={open} onOpenChange={(isOpen) => {
      if (!isOpen) setTimerActive(false);
      onOpenChange(isOpen);
    }} direction="bottom">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content 
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50 rounded-t-3xl shadow-2xl modal-optimized message-handler-optimized"
          // Remove all ARIA attributes that conflict with Radix UI
          suppressHydrationWarning
        >
          {/* Accessibility elements - hidden but available to screen readers */}
          <VisuallyHidden>
            <h2 id="payment-modal-title">Pagamento da Sessão</h2>
            <p id="payment-modal-description">
              Complete o pagamento para sua sessão de fotos de Natal em {dateLabel} ({dayLabel}) às {time}.
            </p>
          </VisuallyHidden>
          
          {/* Handle bar with drag indicator */}
          <div className="flex justify-center p-4">
            <DragIndicator />
          </div>
          
          {/* Content */}
          <div className="px-6 pb-8 max-h-[85vh] overflow-y-auto">
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 shadow-lg">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Pagamento
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Complete sua reserva
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="rounded-full h-10 w-10 p-0 hover:bg-muted/50 modal-optimized"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Session details card */}
            <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl p-6 mb-6 border border-primary/20 shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-primary/20">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground text-sm sm:text-base">{dateLabel} ({dayLabel})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-secondary/20">
                    <Clock className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="font-bold text-base sm:text-lg text-foreground">{time}</span>
                </div>
              </div>
            </div>

            {/* Countdown timer */}
            {isActive && (
              <div className="bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-2xl p-6 mb-6 border-2 border-accent/30 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-yellow-400/10 animate-pulse"></div>
                <div className="relative z-10 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">Redirecionamento automático em:</span>
                  </div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {countdown}s
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Você será redirecionado automaticamente para o pagamento
                  </p>
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="text-center mb-6">
              <p className="text-foreground leading-relaxed text-sm sm:text-base">
                Para confirmar sua sessão de fotos de Natal no dia <span className="font-semibold text-foreground">{dateLabel} ({dayLabel})</span> às <span className="font-semibold text-foreground">{time}</span>, 
                escolha uma das opções abaixo:
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={handlePayNow}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 modal-optimized"
                aria-label="Pagar agora"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pagar Agora
                {isActive && (
                  <Badge className="ml-2 bg-white/20 text-white border-white/30">
                    {countdown}s
                  </Badge>
                )}
              </Button>
              
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="w-full h-14 text-base font-semibold border-2 border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-200 active:scale-95 modal-optimized"
                aria-label="Falar no WhatsApp"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar no WhatsApp
              </Button>
            </div>

            {/* Footer note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                💡 Você pode fechar este modal puxando para baixo ou tocando fora dele
              </p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const OptimizedPaymentModal = memo(OptimizedPaymentModalComponent);
