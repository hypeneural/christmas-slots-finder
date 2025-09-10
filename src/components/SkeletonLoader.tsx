import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'button' | 'text' | 'avatar' | 'slot';
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({ 
  className, 
  variant = 'default',
  width,
  height,
  rounded = true
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-muted/30";
  
  const variantClasses = {
    default: "h-4 w-full",
    card: "h-32 w-full rounded-xl",
    button: "h-12 w-24 rounded-xl",
    text: "h-4 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    slot: "h-16 w-full rounded-2xl"
  };

  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height })
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        rounded && "rounded-md",
        className
      )}
      style={style}
    />
  );
}

// Skeleton para lista de slots
export function SlotListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="native-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton variant="avatar" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </div>
            <Skeleton variant="button" width="60px" height="32px" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} variant="slot" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton para card de pacote
export function PackageCardSkeleton() {
  return (
    <div className="native-card p-6">
      <div className="flex items-start gap-4">
        <Skeleton variant="avatar" width="80px" height="80px" />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" width="80%" height="24px" />
          <Skeleton variant="text" width="60%" height="16px" />
          <Skeleton variant="text" width="90%" height="16px" />
          <div className="flex gap-2 mt-4">
            <Skeleton variant="button" width="100px" height="40px" />
            <Skeleton variant="button" width="80px" height="40px" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton para filtros
export function FiltersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton variant="text" width="120px" height="20px" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="button" height="40px" />
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <Skeleton variant="text" width="100px" height="20px" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton variant="button" height="40px" />
          <Skeleton variant="button" height="40px" />
        </div>
      </div>
    </div>
  );
}

// Skeleton para header
export function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border/20 safe-area-top shadow-sm">
      <div className="app-section py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton variant="avatar" width="40px" height="40px" />
            <div className="space-y-1">
              <Skeleton variant="text" width="120px" height="18px" />
              <Skeleton variant="text" width="80px" height="14px" />
            </div>
          </div>
          <Skeleton variant="button" width="100px" height="40px" />
        </div>
      </div>
    </div>
  );
}
