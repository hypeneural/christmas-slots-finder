import * as React from 'react';
import { Drawer } from 'vaul';
import { X, Calendar, Clock, Gift, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DragIndicator } from './DragIndicator';
import { i18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { memo, useCallback } from 'react';

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

interface TouchFriendlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateLabel: string;
  dayLabel: string;
  time: string;
  onAlreadyPaid: () => void;
  onWantToPay: () => void;
}

const TouchFriendlyModalComponent = ({
  open,
  onOpenChange,
  dateLabel,
  dayLabel,
  time,
  onAlreadyPaid,
  onWantToPay
}: TouchFriendlyModalProps) => {
  // Memoize handlers to prevent unnecessary re-renders
  const handleAlreadyPaid = useCallback(() => {
    // Defer to avoid blocking the UI
    setTimeout(() => onAlreadyPaid(), 0);
  }, [onAlreadyPaid]);

  const handleWantToPay = useCallback(() => {
    // Defer to avoid blocking the UI
    setTimeout(() => onWantToPay(), 0);
  }, [onWantToPay]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction="bottom">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content 
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50 rounded-t-3xl shadow-2xl gpu-accelerated touch-optimized-enhanced vaul-drawer-optimized prevent-reflow modal-optimized message-handler-optimized"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          {/* Accessibility elements - hidden but available to screen readers */}
          <VisuallyHidden>
            <h2 id="modal-title">Confirmação de Sessão</h2>
            <p id="modal-description">
              Confirme sua sessão de fotos de Natal em {dateLabel} ({dayLabel}) às {time}.
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
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {i18n.confirmationTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Confirme sua sessão de fotos
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="rounded-full h-10 w-10 p-0 hover:bg-muted/50"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Session details card */}
            <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl p-6 mb-6 border border-primary/20 shadow-lg relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-20">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/20 shadow-md">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p className="font-bold text-lg text-foreground">
                        {dateLabel} ({dayLabel})
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-secondary/20 shadow-md">
                      <Clock className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Horário</p>
                      <p className="font-bold text-xl text-foreground">{time}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-primary" />
                  <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary font-semibold">
                    Sessão Especial de Natal
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="text-center mb-8">
              <p className="text-muted-foreground leading-relaxed text-base">
                Para garantir sua sessão de fotos de Natal no dia{' '}
                <span className="font-semibold text-foreground">{dateLabel}</span> às{' '}
                <span className="font-semibold text-foreground">{time}</span>, 
                escolha uma das opções abaixo:
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAlreadyPaid}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                aria-label="Já paguei - Abrir WhatsApp"
              >
                <Gift className="w-5 h-5 mr-2" />
                Já paguei - Abrir WhatsApp
              </Button>
              
              <Button
                onClick={handleWantToPay}
                variant="outline"
                className="w-full h-14 text-base font-semibold border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 active:scale-95"
                aria-label="Quero pagar agora"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Quero pagar agora
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
export const TouchFriendlyModal = memo(TouchFriendlyModalComponent);
