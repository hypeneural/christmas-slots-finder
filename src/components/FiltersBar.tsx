import { Filter, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { SimpleFiltersModal } from './SimpleFiltersModal';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';
import { getFilterSummary } from '../lib/filters';
import type { AvailableFilters, Filters } from '../types';
import { useState } from 'react';

interface FiltersBarProps {
  filters: Filters;
  activeCount: number;
  hasActiveFilters: boolean;
  availableFilters?: AvailableFilters | null;
  onApplyFilters: (filters: Filters) => void;
  onClearFilters: () => void;
}

export function FiltersBar({
  filters,
  activeCount,
  hasActiveFilters,
  availableFilters,
  onApplyFilters,
  onClearFilters
}: FiltersBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleClick: handleClickWithFeedback } = useTouchFeedback();
  const summary = getFilterSummary(filters);

  const handleOpenFilters = () => {
    handleClickWithFeedback(() => {
      setIsModalOpen(true);
    });
  };

  const handleCloseFilters = () => {
    setIsModalOpen(false);
  };

  const handleApplyFilters = (newFilters: Filters) => {
    onApplyFilters(newFilters);
    setIsModalOpen(false);
  };

  const handleClearFilters = () => {
    handleClickWithFeedback(() => {
      onClearFilters();
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Filter Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenFilters}
          className="touch-target-enhanced flex-shrink-0 relative h-10 px-4 gpu-accelerated transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline ml-2 font-medium">Filtros</span>
          {activeCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground animate-pulse"
            >
              {activeCount}
            </Badge>
          )}
          {activeCount > 0 && (
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-3 h-3 text-primary animate-twinkle" />
            </div>
          )}
        </Button>

        {/* Clear Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="touch-target-enhanced flex-shrink-0 text-muted-foreground hover:text-destructive h-10 w-10 p-0 gpu-accelerated transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Limpar filtros"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Simple Filters Modal */}
      <SimpleFiltersModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        filters={filters}
        availableFilters={availableFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={onClearFilters}
      />
    </>
  );
}
