import { useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollContainerProps {
  children: React.ReactNode;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function InfiniteScrollContainer({
  children,
  hasMore,
  loading,
  onLoadMore,
  threshold = 200
}: InfiniteScrollContainerProps) {
  const observerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    onLoadMore();
  }, [hasMore, onLoadMore]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          handleLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    );

    intersectionObserver.observe(observer);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [hasMore, loading, handleLoadMore, threshold]);

  return (
    <div className="space-y-4">
      {children}
      
      {hasMore && (
        <div 
          ref={observerRef}
          className="flex items-center justify-center py-8"
        >
          {loading ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Carregando mais horários...</span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground/60">
              Role para carregar mais
            </div>
          )}
        </div>
      )}
      
      {!hasMore && !loading && (
        <div className="text-center py-6 text-muted-foreground/60 text-sm">
          Todos os horários foram carregados
        </div>
      )}
    </div>
  );
}