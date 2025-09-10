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
      variant="native"
      size="native"
      onClick={onClick}
      disabled={disabled}
      className="w-full"
    >
      <div className="flex items-center justify-center gap-3">
        <Clock className="w-5 h-5" />
        <span className="text-lg font-semibold">{time}</span>
      </div>
    </Button>
  );
}