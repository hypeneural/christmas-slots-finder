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
      className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border/20 safe-area-top shadow-sm"
      style={{ paddingTop: 'var(--safe-area-top, 0px)' }}
    >
      <div className="app-section py-4 space-y-4">
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