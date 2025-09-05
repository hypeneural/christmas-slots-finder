import { Button } from './ui/button';
import { Clock } from 'lucide-react';

interface SlotButtonProps {
  time: string;
  onClick: () => void;
  disabled?: boolean;
}

export function SlotButton({ time, onClick, disabled = false }: SlotButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full touch-large bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-secondary text-primary-foreground font-bold shadow-button hover:shadow-christmas active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-[var(--button-radius)]"
    >
      <div className="flex items-center justify-center gap-2">
        <Clock className="w-4 h-4" />
        <span className="text-lg">{time}</span>
      </div>
    </Button>
  );
}