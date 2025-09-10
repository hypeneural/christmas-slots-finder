import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  canRefresh: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 0.5,
  enabled = true
}: UsePullToRefreshOptions) {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    canRefresh: false
  });

  const startY = useRef(0);
  const currentY = useRef(0);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || state.isRefreshing) return;
    
    const scrollTop = elementRef.current?.scrollTop || 0;
    if (scrollTop > 0) return;

    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
  }, [enabled, state.isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || state.isRefreshing) return;

    const scrollTop = elementRef.current?.scrollTop || 0;
    if (scrollTop > 0) return;

    currentY.current = e.touches[0].clientY;
    const pullDistance = Math.max(0, (currentY.current - startY.current) * resistance);

    setState(prev => ({
      ...prev,
      isPulling: pullDistance > 10,
      pullDistance,
      canRefresh: pullDistance >= threshold
    }));

    if (pullDistance > 0) {
      e.preventDefault();
    }
  }, [enabled, state.isRefreshing, resistance, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || state.isRefreshing) return;

    if (state.canRefresh) {
      setState(prev => ({ ...prev, isRefreshing: true, isPulling: false }));
      
      try {
        await onRefresh();
      } finally {
        setState(prev => ({ 
          ...prev, 
          isRefreshing: false, 
          pullDistance: 0,
          canRefresh: false 
        }));
      }
    } else {
      setState(prev => ({ 
        ...prev, 
        isPulling: false, 
        pullDistance: 0,
        canRefresh: false 
      }));
    }
  }, [enabled, state.isRefreshing, state.canRefresh, onRefresh]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);

  const refreshIndicatorStyle = {
    transform: `translateY(${Math.min(state.pullDistance * 0.5, 60)}px)`,
    opacity: state.isPulling ? Math.min(state.pullDistance / threshold, 1) : 0,
  };

  return {
    ...state,
    elementRef,
    refreshIndicatorStyle,
    triggerRefresh: useCallback(async () => {
      if (state.isRefreshing) return;
      setState(prev => ({ ...prev, isRefreshing: true }));
      try {
        await onRefresh();
      } finally {
        setState(prev => ({ ...prev, isRefreshing: false }));
      }
    }, [onRefresh, state.isRefreshing])
  };
}
