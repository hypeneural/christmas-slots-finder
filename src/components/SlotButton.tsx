import { Button } from './ui/button';
import { Clock, Sparkles, CheckCircle } from 'lucide-react';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';
import { memo, useCallback } from 'react';

interface SlotButtonProps {
  time: string;
  onClick: () => void;
  disabled?: boolean;
}

const SlotButtonComponent = ({ time, onClick, disabled = false }: SlotButtonProps) => {
  const {
    isPressed,
    isClicked,
    isSuccess,
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel,
    handleClick: handleClickWithFeedback,
  } = useTouchFeedback();

  const handleClick = useCallback(() => {
    handleClickWithFeedback(onClick);
  }, [handleClickWithFeedback, onClick]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      disabled={disabled}
      className={`w-full h-14 gpu-accelerated touch-optimized layout-stable transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50/90 hover:to-green-50/90 hover:border-red-300/70 hover:shadow-lg hover:shadow-red-200/30 bg-gradient-to-br from-white/90 to-red-50/30 backdrop-blur-sm border-2 border-red-200/50 relative overflow-hidden group ${
        isPressed ? 'animate-button-press scale-95' : 'hover:scale-105'
      } ${isClicked || isSuccess ? 'scale-95 bg-green-100 border-green-300' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* Christmas sparkle effect */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles className="w-3 h-3 text-red-400 animate-twinkle" />
      </div>
      
      {/* Success checkmark when clicked */}
      {(isClicked || isSuccess) && (
        <div className="absolute top-1 left-1 animate-bounce">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
      )}
      
      {/* Ripple effect on touch */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-200/20 to-green-200/20 opacity-0 group-active:opacity-100 transition-opacity duration-150 rounded-md" />
      
      {/* Success ripple effect */}
      {(isClicked || isSuccess) && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-green-300/30 opacity-100 animate-pulse rounded-md" />
      )}
      
      <div className="flex items-center justify-center gap-2 relative z-10">
        <Clock className={`w-4 h-4 transition-colors duration-200 ${
          (isClicked || isSuccess) ? 'text-green-600' : 'text-red-600 group-hover:text-red-700'
        }`} />
        <span className={`text-sm font-semibold transition-colors duration-200 ${
          (isClicked || isSuccess) ? 'text-green-800' : 'text-slate-800 group-hover:text-red-800'
        }`}>
          {time}
        </span>
      </div>
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 rounded-md transition-opacity duration-300 ${
        (isClicked || isSuccess)
          ? 'bg-gradient-to-r from-green-100/0 via-green-100/30 to-green-100/0 opacity-100' 
          : 'bg-gradient-to-r from-red-100/0 via-red-100/20 to-green-100/0 opacity-0 group-hover:opacity-100'
      }`} />
    </Button>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const SlotButton = memo(SlotButtonComponent);