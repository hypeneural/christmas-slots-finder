import * as React from 'react';
import { Drawer } from 'vaul';
import { 
  Filter, 
  X, 
  Calendar, 
  CalendarDays, 
  Clock, 
  Target, 
  Check,
  Sparkles,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { DragIndicator } from './DragIndicator';
import { DayOfWeekPicker } from './DayOfWeekPicker';
import { TimeOfDayPicker } from './TimeOfDayPicker';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';
import { triggerHaptic, countActiveFilters } from '@/lib/filters';
import { format, addDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Filters } from '@/types';
import { memo, useCallback, useEffect, useState } from 'react';

interface SimpleFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
  onClearFilters: () => void;
}

const SimpleFiltersModalComponent = ({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onClearFilters
}: SimpleFiltersModalProps) => {
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

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);

  const dateShortcuts = [
    { label: 'Hoje', date: format(today, 'yyyy-MM-dd') },
    { label: 'Amanhã', date: format(tomorrow, 'yyyy-MM-dd') },
  ];

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

  if (!open) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction="bottom">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content 
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50 rounded-t-3xl shadow-2xl performance-optimized message-handler-optimized flex flex-col max-h-[90vh]"
        >
          {/* Handle bar with drag indicator */}
          <div className="flex justify-center p-4 flex-shrink-0">
            <DragIndicator />
          </div>
          
          {/* Scrollable Content */}
          <div className="px-6 flex-1 overflow-y-auto">
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
                onClick={() => onOpenChange(false)}
                className="rounded-full h-10 w-10 p-0 hover:bg-muted/50"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Date Section */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Datas</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom" className="text-sm font-medium">
                    De
                  </Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={localFilters.dateFrom || ''}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="touch-target-enhanced"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo" className="text-sm font-medium">
                    Até
                  </Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={localFilters.dateTo || ''}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="touch-target-enhanced"
                  />
                </div>
              </div>

              {/* Date shortcuts */}
              <div className="flex gap-2">
                {dateShortcuts.map((shortcut) => (
                  <Button
                    key={shortcut.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setLocalFilters(prev => ({
                      ...prev,
                      dateFrom: shortcut.date,
                      dateTo: ''
                    }))}
                    className="touch-target-enhanced"
                  >
                    {shortcut.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Day of Week Section */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Dias da Semana</h3>
              </div>
              <DayOfWeekPicker
                value={localFilters.daysOfWeek || []}
                onChange={(days) => setLocalFilters(prev => ({ ...prev, daysOfWeek: days }))}
                onlyWeekends={localFilters.onlyWeekends || false}
                onToggleWeekends={(enabled) => setLocalFilters(prev => ({ ...prev, onlyWeekends: enabled }))}
              />
            </div>

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
                exactTime={localFilters.exactTime || ''}
                onExactTimeChange={(exactTime) => setLocalFilters(prev => ({ ...prev, exactTime }))}
                onlyAfter18={localFilters.onlyAfter18 || false}
                onToggleAfter18={(onlyAfter18) => setLocalFilters(prev => ({ ...prev, onlyAfter18 }))}
              />
            </div>
            
            {/* Bottom padding to prevent content from being hidden behind fixed footer */}
            <div className="h-4" />
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div className="flex-shrink-0 px-6 py-4 bg-background border-t border-border/20">
            <div className="flex gap-3">
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex-1 h-12 text-base font-semibold touch-target-enhanced performance-optimized"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-200 touch-target-enhanced performance-optimized"
              >
                <Check className="w-4 h-4 mr-2" />
                Aplicar
                {activeCount > 0 && (
                  <Badge className="ml-2 bg-white/20 text-white border-white/30">
                    {activeCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const SimpleFiltersModal = memo(SimpleFiltersModalComponent);
