import * as React from 'react';
import { Drawer } from 'vaul';
import { 
  Filter, 
  X, 
  CalendarDays, 
  Clock, 
  Check,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { DragIndicator } from './DragIndicator';
import { DayOfWeekPicker } from './DayOfWeekPicker';
import { TimeOfDayPicker } from './TimeOfDayPicker';
import { DateFilterSection } from './DateFilterSection';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';
import { triggerHaptic, countActiveFilters } from '@/lib/filters';
import type { Filters } from '@/types';
import { memo, useCallback, useEffect, useState } from 'react';

// VisuallyHidden component for accessibility
const VisuallyHidden = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0,
    }}
    {...props}
  >
    {children}
  </span>
);

interface TouchFriendlyFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
  onClearFilters: () => void;
}

const TouchFriendlyFiltersModalComponent = ({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onClearFilters
}: TouchFriendlyFiltersModalProps) => {
  const [localFilters, setLocalFilters] = useState<Filters>({
    daysOfWeek: [],
    timeOfDay: [],
    timeRange: ['08:00', '18:00'],
    onlyAfter18: false,
    onlyWeekends: false,
    ...filters
  });
  const { handleClick: handleClickWithFeedback } = useTouchFeedback();

  // Sync with external filters when modal opens
  useEffect(() => {
    if (open) {
      setLocalFilters({
        daysOfWeek: [],
        timeOfDay: [],
        timeRange: ['08:00', '18:00'],
        onlyAfter18: false,
        onlyWeekends: false,
        ...filters
      });
    }
  }, [open, filters]);


  // Memoize handlers to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleApply = useCallback(() => {
    handleClickWithFeedback(() => {
      triggerHaptic('medium');
      onApplyFilters(localFilters);
      onOpenChange(false);
    });
  }, [localFilters, onApplyFilters, onOpenChange, handleClickWithFeedback]);

  const handleClear = useCallback(() => {
    handleClickWithFeedback(() => {
      triggerHaptic('light');
      setLocalFilters({
        daysOfWeek: [],
        timeOfDay: [],
        timeRange: ['08:00', '18:00'],
        onlyAfter18: false,
        onlyWeekends: false
      });
      onClearFilters();
    });
  }, [onClearFilters, handleClickWithFeedback]);


  const activeCount = countActiveFilters(localFilters);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction="bottom">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content 
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50 rounded-t-3xl shadow-2xl gpu-accelerated touch-optimized-enhanced vaul-drawer-optimized prevent-reflow"
        >
          {/* Handle bar with drag indicator */}
          <div className="flex justify-center p-4">
            <DragIndicator />
          </div>
          
          {/* Content */}
          <div className="px-6 pb-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 shadow-lg">
                  <Filter className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Filtros Avançados
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Personalize sua busca
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="rounded-full h-10 w-10 p-0 hover:bg-muted/50"
                aria-label="Fechar filtros"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Active filters count */}
            {activeCount > 0 && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 mb-6 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">
                      {activeCount} filtro{activeCount !== 1 ? 's' : ''} ativo{activeCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                    {activeCount}
                  </Badge>
                </div>
              </div>
            )}

            {/* Day of Week Section - MOVED TO TOP */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Dias da Semana</h3>
              </div>
              <DayOfWeekPicker
                selectedDays={localFilters.daysOfWeek || []}
                onChange={(days) => setLocalFilters(prev => ({ ...prev, daysOfWeek: days }))}
              />
            </div>

            <Separator className="my-6" />

            {/* Date Range Section - MOVED TO SECOND POSITION */}
            <DateFilterSection
              dateFrom={localFilters.dateFrom}
              dateTo={localFilters.dateTo}
              onDateFromChange={(date) => setLocalFilters(prev => ({ ...prev, dateFrom: date }))}
              onDateToChange={(date) => setLocalFilters(prev => ({ ...prev, dateTo: date }))}
            />

            <Separator className="my-6" />

            {/* Time Section */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Horários</h3>
              </div>
              <TimeOfDayPicker
                timeOfDay={localFilters.timeOfDay || []}
                onTimeOfDayChange={(timeOfDay) => setLocalFilters(prev => ({ ...prev, timeOfDay }))}
                timeRange={localFilters.timeRange || ['08:00', '18:00']}
                onTimeRangeChange={(timeRange) => setLocalFilters(prev => ({ ...prev, timeRange }))}
                exactTime={localFilters.exactTime}
                onExactTimeChange={(exactTime) => setLocalFilters(prev => ({ ...prev, exactTime }))}
                onlyAfter18={localFilters.onlyAfter18}
                onToggleAfter18={(onlyAfter18) => setLocalFilters(prev => ({ ...prev, onlyAfter18 }))}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-8">
              <Button
                onClick={handleApply}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 relative overflow-hidden group"
                aria-label="Aplicar filtros"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Check className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Aplicar Filtros</span>
              </Button>
              
              {activeCount > 0 && (
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="w-full h-12 text-base font-semibold border-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-200 active:scale-95"
                  aria-label="Limpar todos os filtros"
                >
                  <X className="w-5 h-5 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>

            {/* Footer note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                💡 Você pode fechar este modal puxando para baixo ou tocando fora dele
              </p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const TouchFriendlyFiltersModal = memo(TouchFriendlyFiltersModalComponent);
