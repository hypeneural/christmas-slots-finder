import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOptimizedTimerOptions {
  initialTime: number;
  onComplete?: () => void;
  active: boolean;
}

export function useOptimizedTimer({ 
  initialTime, 
  onComplete, 
  active 
}: UseOptimizedTimerOptions) {
  const [time, setTime] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout>();

  const reset = useCallback(() => {
    setTime(initialTime);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [initialTime]);

  const start = useCallback(() => {
    reset();
    setTime(initialTime);
    
    // Use setInterval for accurate second-by-second countdown
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialTime, onComplete, reset]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    if (active) {
      start();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [active, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    time,
    reset,
    start,
    stop,
    isActive: active && time > 0
  };
}
