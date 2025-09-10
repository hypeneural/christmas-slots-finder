import { CategoryDropdown } from './CategoryDropdown';
import { FiltersBar } from './FiltersBar';
import { FloatingFilters } from './FloatingFilters';
import { useStickyState } from '../hooks/useStickyState';
import type { CategorizedPaged, CategoryKey, Filters } from '../types';

interface CompactControlsProps {
  categorizedPaged: CategorizedPaged;
  selectedCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
  filters: Filters;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onApplyFilters: (filters: Filters) => void;
  onClearFilters: () => void;
}

export function CompactControls({
  categorizedPaged,
  selectedCategory,
  onCategoryChange,
  filters,
  activeFiltersCount,
  hasActiveFilters,
  onApplyFilters,
  onClearFilters
}: CompactControlsProps) {
  const { isSticky, elementRef } = useStickyState();

  return (
    <>
      <div 
        ref={elementRef}
        className={`sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/20 safe-area-top shadow-sm transition-all duration-200 ${
          !isSticky ? 'mb-4' : ''
        }`}
        style={{ 
          paddingTop: 'var(--safe-area-top, 0px)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 w-full">
            {/* Category Selection - Takes most space */}
            <div className="flex-1 min-w-0">
              <CategoryDropdown
                categorizedPaged={categorizedPaged}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
              />
            </div>
            
            {/* Filters - Always show in sticky bar */}
            <div className="flex-shrink-0">
              <FiltersBar
                filters={filters}
                activeCount={activeFiltersCount}
                hasActiveFilters={hasActiveFilters}
                onApplyFilters={onApplyFilters}
                onClearFilters={onClearFilters}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Filters - Show when not sticky */}
      <FloatingFilters
        filters={filters}
        activeCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        isSticky={isSticky}
      />
    </>
  );
}