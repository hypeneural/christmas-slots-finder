import { useState, useEffect } from 'react';
import { Filter, X, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getFilterSummary } from '../lib/filters';
import { triggerHaptic } from '../lib/filters';
import type { Filters } from '../types';

interface FloatingFiltersProps {
  filters: Filters;
  activeCount: number;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  onClearFilters: () => void;
  isSticky: boolean;
}

export function FloatingFilters({
  filters,
  activeCount,
  hasActiveFilters,
  onOpenFilters,
  onClearFilters,
  isSticky
}: FloatingFiltersProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const summary = getFilterSummary(filters);

  // Show floating filters when not sticky and has filters
  useEffect(() => {
    setIsVisible(!isSticky && hasActiveFilters);
  }, [isSticky, hasActiveFilters]);

  const handleOpenFilters = () => {
    triggerHaptic('light');
    onOpenFilters();
  };

  const handleClearFilters = () => {
    triggerHaptic('light');
    onClearFilters();
  };

  const toggleExpanded = () => {
    triggerHaptic('light');
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-float-up">
      <div className="flex flex-col items-end gap-3">
        {/* Summary Chips - Expandable */}
        {isExpanded && summary.length > 0 && (
          <div className="bg-card/95 backdrop-blur-xl border border-border/20 rounded-2xl p-4 shadow-2xl max-w-xs">
            <div className="flex flex-wrap gap-2">
              {summary.map((chip, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-0 text-xs px-3 py-1.5"
                >
                  {chip}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Main Floating Button */}
        <div className="flex items-center gap-2">
          {/* Clear Button */}
          {hasActiveFilters && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearFilters}
              className="h-12 w-12 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5" />
            </Button>
          )}

          {/* Filter Button */}
          <Button
            variant="default"
            size="sm"
            onClick={handleOpenFilters}
            className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 relative animate-bounce-gentle"
          >
            <Filter className="w-6 h-6" />
            {activeCount > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 h-6 w-6 p-0 text-xs bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold"
              >
                {activeCount}
              </Badge>
            )}
          </Button>

          {/* Expand Button */}
          {summary.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpanded}
              className={`h-10 w-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
                isExpanded ? 'bg-primary/10 border-primary' : ''
              }`}
            >
              <ChevronUp 
                className={`w-4 h-4 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`} 
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
