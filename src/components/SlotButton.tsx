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
      className="w-full touch-target bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-secondary text-primary-foreground font-medium shadow-christmas hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      size="lg"
    >
      <Clock className="w-4 h-4 mr-2" />
      {time}
    </Button>
  );
}