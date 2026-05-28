import * as React from 'react';
import { Drawer } from 'vaul';
import { 
  Filter, 
  X, 
  Calendar, 
  CalendarDays, 
  Clock, 
  Check
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
import type { AvailableFilters, Filters } from '@/types';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

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

interface SimpleFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  availableFilters?: AvailableFilters | null;
  onApplyFilters: (filters: Filters) => void;
  onClearFilters: () => void;
}

const SimpleFiltersModalComponent = ({
  open,
  onOpenChange,
  filters,
  availableFilters,
  onApplyFilters,
  onClearFilters
}: SimpleFiltersModalProps) => {
  const [localFilters, setLocalFilters] = useState<Filters>({
    daysOfWeek: [],
    timeOfDay: [],
    timeRange: ['08:00', '18:00'],
    onlyAfter18: false,
    onlyWeekends: false,
    onlyHolidays: false,
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
        onlyHolidays: false,
        ...filters
      });
    }
  }, [open, filters]);

  const { dateOptions, minDate } = useMemo(() => {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const nextWeek = addDays(today, 7);
    const nextMonth = addDays(today, 30);
    const todayValue = format(today, 'yyyy-MM-dd');

    return {
      minDate: todayValue,
      dateOptions: [
        { value: '', label: 'Selecionar período' },
        { value: 'today', label: 'Hoje', date: todayValue },
        { value: 'tomorrow', label: 'Amanhã', date: format(tomorrow, 'yyyy-MM-dd') },
        { value: 'week', label: 'Próximos 7 dias', dateFrom: todayValue, dateTo: format(nextWeek, 'yyyy-MM-dd') },
        { value: 'month', label: 'Próximos 30 dias', dateFrom: todayValue, dateTo: format(nextMonth, 'yyyy-MM-dd') },
      ],
    };
  }, []);

  const formatLocalDate = useCallback((date: string) => (
    format(new Date(`${date}T12:00:00`), 'dd/MM/yyyy')
  ), []);

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
        onlyWeekends: false,
        onlyHolidays: false
      });
      onClearFilters();
    });
  }, [onClearFilters, handleClickWithFeedback]);

  const handleDateOptionChange = useCallback((optionValue: string) => {
    const option = dateOptions.find(opt => opt.value === optionValue);
    if (!option || !optionValue) {
      setLocalFilters(prev => ({ ...prev, dateFrom: undefined, dateTo: undefined }));
      return;
    }

    if (option.date) {
      setLocalFilters(prev => ({ 
        ...prev, 
        dateFrom: option.date, 
        dateTo: undefined 
      }));
    } else if (option.dateFrom && option.dateTo) {
      setLocalFilters(prev => ({ 
        ...prev, 
        dateFrom: option.dateFrom, 
        dateTo: option.dateTo 
      }));
    }
  }, [dateOptions]);

  const activeCount = countActiveFilters(localFilters);

  if (!open) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction="bottom">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content 
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/50 rounded-t-3xl shadow-2xl performance-optimized message-handler-optimized flex flex-col max-h-[90vh]"
        >
          <VisuallyHidden>
            <Drawer.Title>Filtros Avançados</Drawer.Title>
            <Drawer.Description>
              Modal para personalizar filtros de busca de horários disponíveis.
            </Drawer.Description>
          </VisuallyHidden>
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

            {/* Day of Week Section - MOVED TO TOP */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Dias da Semana</h3>
              </div>
              <DayOfWeekPicker
                selectedDays={localFilters.daysOfWeek || []}
                onChange={(days) => setLocalFilters(prev => ({ ...prev, daysOfWeek: days }))}
                options={availableFilters?.daysOfWeekOptions}
              />
            </div>

            <Separator className="my-6" />

            {/* Date Section - IMPROVED WITH SELECT */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Período</h3>
              </div>
              
              {/* Date Select */}
              <div className="space-y-3">
                <Label htmlFor="dateSelect" className="text-sm font-medium">
                  Selecionar período
                </Label>
                <select
                  id="dateSelect"
                  value={(() => {
                    if (localFilters.dateFrom && !localFilters.dateTo) {
                      const option = dateOptions.find(opt => opt.date === localFilters.dateFrom);
                      return option?.value || '';
                    }
                    if (localFilters.dateFrom && localFilters.dateTo) {
                      const option = dateOptions.find(opt => 
                        opt.dateFrom === localFilters.dateFrom && opt.dateTo === localFilters.dateTo
                      );
                      return option?.value || '';
                    }
                    return '';
                  })()}
                  onChange={(e) => handleDateOptionChange(e.target.value)}
                  className="w-full h-12 px-4 text-base bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                >
                  {dateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Date Range - Only show if no preset is selected */}
              {!localFilters.dateFrom && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="dateFrom" className="text-sm font-medium">
                      Data inicial
                    </Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={localFilters.dateFrom || ''}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      className="h-12 text-base"
                      min={minDate}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateTo" className="text-sm font-medium">
                      Data final
                    </Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={localFilters.dateTo || ''}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      className="h-12 text-base"
                      min={localFilters.dateFrom || minDate}
                    />
                  </div>
                </div>
              )}

              {availableFilters?.hasHolidays && (
                <div className="space-y-3 rounded-lg border border-border/50 bg-muted/20 p-3">
                  <Button
                    type="button"
                    variant={localFilters.onlyHolidays ? 'default' : 'outline'}
                    onClick={() => setLocalFilters(prev => ({
                      ...prev,
                      onlyHolidays: !prev.onlyHolidays,
                    }))}
                    className="w-full justify-start h-11"
                  >
                    Somente feriados e datas especiais
                  </Button>

                  {availableFilters.holidayDates.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="holidayDate" className="text-sm font-medium">
                        Escolher uma data especial
                      </Label>
                      <select
                        id="holidayDate"
                        value={
                          localFilters.dateFrom &&
                          localFilters.dateFrom === localFilters.dateTo &&
                          availableFilters.holidayDates.includes(localFilters.dateFrom)
                            ? localFilters.dateFrom
                            : ''
                        }
                        onChange={(event) => setLocalFilters(prev => ({
                          ...prev,
                          dateFrom: event.target.value || undefined,
                          dateTo: event.target.value || undefined,
                          onlyHolidays: event.target.value ? true : prev.onlyHolidays,
                        }))}
                        className="w-full h-11 px-3 text-base bg-background border border-input rounded-lg"
                      >
                        <option value="">Todas as datas especiais</option>
                        {availableFilters.holidayDates.map((date) => (
                          <option key={date} value={date}>
                            {formatLocalDate(date)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Active Date Filter Summary */}
              {(localFilters.dateFrom || localFilters.dateTo) && (
                <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Período selecionado:</p>
                  <p className="text-sm font-medium">
                    {localFilters.dateFrom && `De: ${formatLocalDate(localFilters.dateFrom)}`}
                    {localFilters.dateFrom && localFilters.dateTo && ' • '}
                    {localFilters.dateTo && `Até: ${formatLocalDate(localFilters.dateTo)}`}
                  </p>
                </div>
              )}
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
                timePeriodOptions={availableFilters?.timePeriodOptions}
                availableTimes={availableFilters?.times}
                hasAfterHours={availableFilters?.hasAfterHours}
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
                className="flex-1 h-14 text-base font-semibold touch-target-enhanced performance-optimized"
                disabled={activeCount === 0}
              >
                <X className="w-5 h-5 mr-2" />
                Limpar
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-200 touch-target-enhanced performance-optimized"
              >
                <Check className="w-5 h-5 mr-2" />
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
