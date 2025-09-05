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
      <DialogContent className="sm:max-w-md mx-4 app-card border-border/50">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto p-4 rounded-full bg-primary/20">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          
          <DialogTitle className="text-2xl font-bold text-foreground">
            {i18n.confirmationTitle}
          </DialogTitle>
          
          <div className="flex items-center justify-center gap-6 py-4 text-muted-foreground bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-semibold">{dateLabel} ({dayLabel})</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              <span className="font-semibold text-lg">{time}</span>
            </div>
          </div>
          
          <DialogDescription className="text-center text-foreground leading-relaxed text-base">
            Para garantir sua sessão de fotos de Natal no dia <strong>{dateLabel} ({dayLabel})</strong> às <strong>{time}</strong>, é necessário efetuar o pagamento da entrada. Você já pagou a entrada?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col gap-4 sm:flex-col mt-6">
          <Button
            onClick={onAlreadyPaid}
            className="w-full touch-large bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold shadow-button hover:shadow-christmas scale-tap"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {i18n.alreadyPaid}
          </Button>
          
          <Button
            onClick={onWantToPay}
            variant="outline"
            className="w-full touch-large border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-bold scale-tap"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {i18n.wantToPay}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}