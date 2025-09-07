import { Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getFilterSummary } from '../lib/filters';
import type { Filters } from '../types';

interface FiltersBarProps {
  filters: Filters;
  activeCount: number;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  onClearFilters: () => void;
}

export function FiltersBar({
  filters,
  activeCount,
  hasActiveFilters,
  onOpenFilters,
  onClearFilters
}: FiltersBarProps) {
  const summary = getFilterSummary(filters);

  return (
    <div 
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 safe-area-top"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="app-section py-3">
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenFilters}
            className="touch-target flex-shrink-0 relative"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {activeCount > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground"
              >
                {activeCount}
              </Badge>
            )}
          </Button>

          {/* Summary Chips */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {summary.map((chip, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex-shrink-0 bg-muted/50 text-muted-foreground border-border/50"
              >
                {chip}
              </Badge>
            ))}
          </div>

          {/* Clear Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="touch-target flex-shrink-0 text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Limpar</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}