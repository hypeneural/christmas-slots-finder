import { CategoryDropdown } from './CategoryDropdown';
import { FiltersBar } from './FiltersBar';
import type { CategorizedPaged, CategoryKey, Filters } from '../types';

interface CompactControlsProps {
  categorizedPaged: CategorizedPaged;
  selectedCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
  filters: Filters;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  onClearFilters: () => void;
}

export function CompactControls({
  categorizedPaged,
  selectedCategory,
  onCategoryChange,
  filters,
  activeFiltersCount,
  hasActiveFilters,
  onOpenFilters,
  onClearFilters
}: CompactControlsProps) {
  return (
    <div 
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/30 safe-area-top"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="app-section py-3 space-y-3">
        {/* Category Selection */}
        <CategoryDropdown
          categorizedPaged={categorizedPaged}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
        
        {/* Filters */}
        <FiltersBar
          filters={filters}
          activeCount={activeFiltersCount}
          hasActiveFilters={hasActiveFilters}
          onOpenFilters={onOpenFilters}
          onClearFilters={onClearFilters}
        />
      </div>
    </div>
  );
}