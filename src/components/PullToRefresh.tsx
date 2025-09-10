import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { RefreshCw, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
  threshold?: number;
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  className,
  enabled = true,
  threshold = 80
}: PullToRefreshProps) {
  const {
    isPulling,
    isRefreshing,
    pullDistance,
    canRefresh,
    elementRef,
    refreshIndicatorStyle
  } = usePullToRefresh({
    onRefresh,
    threshold,
    enabled
  });

  return (
    <div className={cn("relative", className)}>
      {/* Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center py-4 pointer-events-none"
        style={refreshIndicatorStyle}
      >
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border/20 shadow-lg transition-all duration-200",
          canRefresh && "bg-primary/10 border-primary/20"
        )}>
          {isRefreshing ? (
            <>
              <RefreshCw className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm font-medium text-primary">Atualizando...</span>
            </>
          ) : (
            <>
              <ChevronDown 
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  canRefresh && "rotate-180 text-primary"
                )} 
              />
              <span className={cn(
                "text-sm font-medium transition-colors duration-200",
                canRefresh ? "text-primary" : "text-muted-foreground"
              )}>
                {canRefresh ? "Solte para atualizar" : "Puxe para atualizar"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        ref={elementRef}
        className={cn(
          "transition-transform duration-200 ease-out",
          isPulling && "transform-gpu"
        )}
        style={{
          transform: isPulling ? `translateY(${Math.min(pullDistance * 0.3, 20)}px)` : 'translateY(0)'
        }}
      >
        {children}
      </div>
    </div>
  );
}
