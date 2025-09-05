import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Calendar, Clock } from 'lucide-react';
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
      <DialogContent className="sm:max-w-md mx-4 bg-card border-border">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-foreground">
            {i18n.confirmationTitle}
          </DialogTitle>
          
          <div className="flex items-center justify-center gap-4 py-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{dateLabel} ({dayLabel})</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{time}</span>
            </div>
          </div>
          
          <DialogDescription className="text-center text-foreground leading-relaxed">
            Para garantir sua sessão de fotos de Natal no dia <strong>{dateLabel} ({dayLabel})</strong> às <strong>{time}</strong>, é necessário efetuar o pagamento da entrada. Você já pagou a entrada?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-col">
          <Button
            onClick={onAlreadyPaid}
            className="w-full touch-target bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium shadow-christmas hover:shadow-glow"
            size="lg"
          >
            {i18n.alreadyPaid}
          </Button>
          
          <Button
            onClick={onWantToPay}
            variant="outline"
            className="w-full touch-target border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            size="lg"
          >
            {i18n.wantToPay}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}