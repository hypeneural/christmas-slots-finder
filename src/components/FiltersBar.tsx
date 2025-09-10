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
    <div className="flex items-center gap-2">
      {/* Filter Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenFilters}
        className="touch-target flex-shrink-0 relative h-9 px-3"
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

      {/* Clear Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="touch-target flex-shrink-0 text-muted-foreground hover:text-destructive h-9 w-9 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}