import * as React from 'react';
import { Drawer } from 'vaul';
import { CreditCard, MessageCircle, Timer, AlertCircle, Sparkles, Gift, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DragIndicator } from './DragIndicator';
import { i18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useOptimizedTimer } from '@/hooks/useOptimizedTimer';
import { memo, useCallback, useEffect, useState } from 'react';

// VisuallyHidden component for accessibility
const VisuallyHidden = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0,
    }}
    {...props}
  >
    {children}
  </span>
);

interface TouchFriendlyPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateLabel: string;
  dayLabel: string;
  time: string;
}

const TouchFriendlyPaymentModalComponent = ({
  open,
  onOpenChange,
  dateLabel,
  dayLabel,
  time
}: TouchFriendlyPaymentModalProps) => {
  const [timerActive, setTimerActive] = useState(false);

  // Memoize handlers to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handlePayNow = useCallback(() => {
    setTimerActive(false);
    // Defer heavy operations to avoid blocking
    setTimeout(() => {
      const paymentUrl = import.meta.env.VITE_PAYMENT_URL || 'https://evydencia.com/catalogo/natal';
      window.open(paymentUrl, '_blank');
      onOpenChange(false);
    }, 0);
  }, [onOpenChange]);

  const handleWhatsApp = useCallback(() => {
    setTimerActive(false);
    // Defer heavy operations to avoid blocking
    setTimeout(() => {
      const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || 'https://w.fotosdenatal.com/';
      window.open(whatsappUrl, '_blank');
      onOpenChange(false);
    }, 0);
  }, [onOpenChange]);

  // Optimized timer
  const { time: countdown, isActive } = useOptimizedTimer({
    initialTime: 10,
    onComplete: handlePayNow,
    active: timerActive
  });

  // Timer effect
  useEffect(() => {
    if (open) {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [open]);

  return (
    <Drawer.Root open={open} onOpenChange={(isOpen) => {
      if (!isOpen) setTimerActive(false);
      onOpenChange(isOpen);
    }} direction="bottom">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content 
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50 rounded-t-3xl shadow-2xl gpu-accelerated touch-optimized-enhanced vaul-drawer-optimized prevent-reflow modal-optimized message-handler-optimized"
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-modal-title"
          aria-describedby="payment-modal-description"
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
                <div className="p-3 rounded-2xl bg-gradient-to-br from-accent/20 to-yellow-400/20 shadow-lg">
                  <CreditCard className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {i18n.paymentTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Complete seu pagamento
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="rounded-full h-10 w-10 p-0 hover:bg-muted/50"
                aria-label="Fechar modal de pagamento"
              >
                <Clock className="w-5 h-5" />
              </Button>
            </div>

            {/* Session details card */}
            <div className="bg-gradient-to-br from-accent/10 via-yellow-400/5 to-accent/10 rounded-2xl p-6 mb-6 border border-accent/20 shadow-lg relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-20">
                <Sparkles className="w-8 h-8 text-accent animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-400/20 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent/20 shadow-md">
                      <Gift className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sessão</p>
                      <p className="font-bold text-lg text-foreground">
                        {dateLabel} ({dayLabel})
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-yellow-400/20 shadow-md">
                      <Timer className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Horário</p>
                      <p className="font-bold text-xl text-foreground">{time}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-accent" />
                  <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent font-semibold">
                    Pagamento Seguro
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timer countdown */}
            {isActive && (
              <div className="bg-gradient-to-r from-accent/20 to-yellow-400/20 rounded-2xl p-6 mb-6 border-2 border-accent/30 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-yellow-400/10 animate-pulse" />
                <div className="relative z-10 flex items-center justify-center gap-4">
                  <div className="p-3 rounded-full bg-accent/30 shadow-lg">
                    <Timer className="w-6 h-6 text-accent animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Redirecionando automaticamente em:</p>
                    <p className="text-3xl font-bold text-accent animate-bounce">
                      ⏰ {countdown}s
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment info */}
            <div className="bg-muted/20 rounded-2xl p-6 mb-6 border border-muted/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Informações Importantes</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {i18n.paymentMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={handlePayNow}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 relative overflow-hidden group"
                aria-label="Pagar agora"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CreditCard className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">💳 {i18n.payNow}</span>
              </Button>
              
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="w-full h-14 text-base font-semibold border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 active:scale-95"
                aria-label="Contatar via WhatsApp"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                💬 {i18n.whatsappContact}
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

// Memoize the component to prevent unnecessary re-renders
export const TouchFriendlyPaymentModal = memo(TouchFriendlyPaymentModalComponent);
