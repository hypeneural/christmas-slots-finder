import { useState, useCallback, useRef, useMemo } from 'react';
import { triggerHaptic } from '@/lib/filters';

interface TouchFeedbackState {
  isPressed: boolean;
  isClicked: boolean;
  isSuccess: boolean;
}

export function useTouchFeedback() {
  const [state, setState] = useState<TouchFeedbackState>({
    isPressed: false,
    isClicked: false,
    isSuccess: false,
  });
  
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Optimized touch handlers with debouncing for better performance
  const handleTouchStart = useCallback(() => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      setState(prev => ({ ...prev, isPressed: true }));
      // Defer haptic feedback to avoid blocking
      setTimeout(() => triggerHaptic('light'), 0);
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    requestAnimationFrame(() => {
      setState(prev => ({ ...prev, isPressed: false }));
    });
  }, []);

  const handleTouchCancel = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false }));
  }, []);

  const handleClick = useCallback((onClick: () => void) => {
    // Immediate state update for better responsiveness
    setState(prev => ({ ...prev, isClicked: true }));
    
    // Use multiple microtasks to defer heavy operations
    Promise.resolve().then(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          triggerHaptic('medium');
          onClick();
          resolve(void 0);
        }, 0);
      });
    }).then(() => {
      // Reset click state after animation
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isClicked: false }));
      }, 300);
    });
  }, []);

  const showSuccess = useCallback(() => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      setState(prev => ({ ...prev, isSuccess: true }));
      
      // Defer heavy operations to avoid blocking
      setTimeout(() => {
        triggerHaptic('heavy');
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          setState(prev => ({ ...prev, isSuccess: false }));
        }, 1000);
      }, 0);
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      isPressed: false,
      isClicked: false,
      isSuccess: false,
    });
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    ...state,
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel,
    handleClick,
    showSuccess,
    reset,
  }), [state, handleTouchStart, handleTouchEnd, handleTouchCancel, handleClick, showSuccess, reset]);
}
