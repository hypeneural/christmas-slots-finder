import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DragIndicatorProps {
  className?: string;
}

export function DragIndicator({ className }: DragIndicatorProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
      <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
        <ChevronUp className="w-3 h-3" />
        <span>Arraste para fechar</span>
        <ChevronUp className="w-3 h-3" />
      </div>
    </div>
  );
}
