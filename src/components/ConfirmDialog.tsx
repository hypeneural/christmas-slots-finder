import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Calendar, Clock, CheckCircle, CreditCard } from 'lucide-react';
import { i18n } from '../lib/i18n';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateLabel: string;
  dayLabel: string;
  time: string;
  onAlreadyPaid: () => void;
  onWantToPay: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  dateLabel,
  dayLabel,
  time,
  onAlreadyPaid,
  onWantToPay
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-4 my-4 max-h-[90vh] overflow-y-auto app-card border-border/50 shadow-2xl backdrop-blur-sm">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto p-4 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 shadow-glow">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          
          <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
            {i18n.confirmationTitle}
          </DialogTitle>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-4 text-muted-foreground bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl shadow-inner border border-primary/20">
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
          
          <DialogDescription className="text-center text-foreground leading-relaxed text-sm sm:text-base">
            Para garantir sua sessão de fotos de Natal no dia <strong>{dateLabel} ({dayLabel})</strong> às <strong>{time}</strong>, é necessário efetuar o pagamento da entrada. Você já pagou a entrada?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col gap-3 sm:gap-4 mt-6">
          <Button
            onClick={onAlreadyPaid}
            className="w-full h-12 sm:h-14 touch-large bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold shadow-christmas hover:shadow-glow relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CheckCircle className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10 text-sm sm:text-base">✅ {i18n.alreadyPaid}</span>
          </Button>
          
          <Button
            onClick={onWantToPay}
            variant="outline"
            className="w-full h-12 sm:h-14 touch-large border-2 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground font-bold shadow-button hover:shadow-glow hover:border-accent transition-all duration-300"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            <span className="text-sm sm:text-base">💳 {i18n.wantToPay}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}