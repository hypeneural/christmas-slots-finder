import { Button } from './ui/button';
import { Clock, Sparkles } from 'lucide-react';
import { triggerHaptic } from '@/lib/filters';
import { useState } from 'react';

interface SlotButtonProps {
  time: string;
  onClick: () => void;
  disabled?: boolean;
}

export function SlotButton({ time, onClick, disabled = false }: SlotButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    triggerHaptic('medium');
    onClick();
  };

  const handleTouchStart = () => {
    setIsPressed(true);
    triggerHaptic('light');
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={disabled}
      className={`w-full h-14 gpu-accelerated transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50/90 hover:to-green-50/90 hover:border-red-300/70 hover:shadow-lg hover:shadow-red-200/30 bg-gradient-to-br from-white/90 to-red-50/30 backdrop-blur-sm border-2 border-red-200/50 relative overflow-hidden group ${
        isPressed ? 'animate-button-press scale-95' : 'hover:scale-105'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* Christmas sparkle effect */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles className="w-3 h-3 text-red-400 animate-twinkle" />
      </div>
      
      {/* Ripple effect on touch */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-200/20 to-green-200/20 opacity-0 group-active:opacity-100 transition-opacity duration-150 rounded-md" />
      
      <div className="flex items-center justify-center gap-2 relative z-10">
        <Clock className="w-4 h-4 text-red-600 group-hover:text-red-700 transition-colors duration-200" />
        <span className="text-sm font-semibold text-slate-800 group-hover:text-red-800 transition-colors duration-200">
          {time}
        </span>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-red-100/0 via-red-100/20 to-green-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Button>
  );
}