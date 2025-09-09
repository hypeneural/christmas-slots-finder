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
    <div className="flex items-center gap-2 w-full">
      {/* Filter Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenFilters}
        className="touch-target flex-shrink-0 relative h-10"
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline ml-1">Filtros</span>
        {activeCount > 0 && (
          <Badge 
            variant="secondary" 
            className="ml-1 h-4 w-4 p-0 text-xs bg-primary text-primary-foreground"
          >
            {activeCount}
          </Badge>
        )}
      </Button>

      {/* Summary Chips - Mobile friendly */}
      {summary.length > 0 && (
        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {summary.slice(0, 2).map((chip, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex-shrink-0 bg-muted/30 text-muted-foreground border-0 text-xs px-2 py-1"
            >
              {chip}
            </Badge>
          ))}
          {summary.length > 2 && (
            <Badge variant="secondary" className="flex-shrink-0 bg-muted/30 text-muted-foreground border-0 text-xs px-2 py-1">
              +{summary.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Clear Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="touch-target flex-shrink-0 text-muted-foreground hover:text-destructive h-10 w-10 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}