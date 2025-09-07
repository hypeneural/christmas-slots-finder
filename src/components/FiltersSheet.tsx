import { useState, useEffect } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CalendarDays, Clock, Target } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { DayOfWeekPicker } from './DayOfWeekPicker';
import { TimeOfDayPicker } from './TimeOfDayPicker';
import type { Filters } from '../types';
import { triggerHaptic, countActiveFilters } from '../lib/filters';

interface FiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
  onClearFilters: () => void;
}

export function FiltersSheet({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onClearFilters
}: FiltersSheetProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  // Sync with external filters when sheet opens
  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);

  const dateShortcuts = [
    { label: 'Hoje', date: format(today, 'yyyy-MM-dd') },
    { label: 'Amanhã', date: format(tomorrow, 'yyyy-MM-dd') },
    { label: 'Próx. 7 dias', dateFrom: format(today, 'yyyy-MM-dd'), dateTo: format(addDays(today, 7), 'yyyy-MM-dd') },
    { label: 'Próx. 14 dias', dateFrom: format(today, 'yyyy-MM-dd'), dateTo: format(addDays(today, 14), 'yyyy-MM-dd') },
    { label: 'Próx. 30 dias', dateFrom: format(today, 'yyyy-MM-dd'), dateTo: format(addDays(today, 30), 'yyyy-MM-dd') },
  ];

  const handleDateShortcut = (shortcut: any) => {
    if (shortcut.date) {
      setLocalFilters({ ...localFilters, dateFrom: shortcut.date, dateTo: undefined });
    } else {
      setLocalFilters({ ...localFilters, dateFrom: shortcut.dateFrom, dateTo: shortcut.dateTo });
    }
    triggerHaptic('light');
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
    triggerHaptic('success');
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
    onOpenChange(false);
    triggerHaptic('light');
  };

  const activeCount = countActiveFilters(localFilters);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] max-h-[85vh] overflow-y-auto safe-area-bottom"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="flex items-center gap-2">
            🎄 Filtros Avançados
            {activeCount > 0 && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {activeCount}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Encontre o horário perfeito para sua sessão de Natal
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pb-24">
          {/* Date Filters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <h3 className="font-medium">Datas</h3>
            </div>

            {/* Date Shortcuts */}
            <div className="grid grid-cols-2 gap-2">
              {dateShortcuts.map((shortcut, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDateShortcut(shortcut)}
                  className="touch-target justify-start text-left"
                >
                  <Calendar className="w-3 h-3 mr-2" />
                  {shortcut.label}
                </Button>
              ))}
            </div>

            {/* Custom Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="dateFrom" className="text-sm">De</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={localFilters.dateFrom || ''}
                  onChange={(e) => setLocalFilters({ 
                    ...localFilters, 
                    dateFrom: e.target.value || undefined 
                  })}
                  className="touch-target mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-sm">Até</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={localFilters.dateTo || ''}
                  onChange={(e) => setLocalFilters({ 
                    ...localFilters, 
                    dateTo: e.target.value || undefined 
                  })}
                  className="touch-target mt-1"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Day of Week */}
          <DayOfWeekPicker
            value={localFilters.daysOfWeek || []}
            onChange={(days) => setLocalFilters({ ...localFilters, daysOfWeek: days.length > 0 ? days : undefined })}
            onlyWeekends={localFilters.onlyWeekends || false}
            onToggleWeekends={(enabled) => setLocalFilters({ 
              ...localFilters, 
              onlyWeekends: enabled || undefined,
              daysOfWeek: enabled ? ['Sat', 'Sun'] : undefined
            })}
          />

          <Separator />

          {/* Time Filters */}
          <TimeOfDayPicker
            timeOfDay={localFilters.timeOfDay || []}
            onTimeOfDayChange={(times) => setLocalFilters({ 
              ...localFilters, 
              timeOfDay: times.length > 0 ? times : undefined 
            })}
            timeRange={localFilters.timeRange}
            onTimeRangeChange={(range) => setLocalFilters({ ...localFilters, timeRange: range })}
            exactTime={localFilters.exactTime}
            onExactTimeChange={(time) => setLocalFilters({ ...localFilters, exactTime: time })}
            onlyAfter18={localFilters.onlyAfter18 || false}
            onToggleAfter18={(enabled) => setLocalFilters({ 
              ...localFilters, 
              onlyAfter18: enabled || undefined 
            })}
          />

          <Separator />

          {/* Quality Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <h3 className="font-medium">Qualidade</h3>
            </div>
            
            <div>
              <Label htmlFor="minSlots" className="text-sm">
                Mínimo de horários por data
              </Label>
              <Input
                id="minSlots"
                type="number"
                min="1"
                max="10"
                value={localFilters.minSlotsPerDate || ''}
                onChange={(e) => setLocalFilters({ 
                  ...localFilters, 
                  minSlotsPerDate: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="Ex: 2"
                className="touch-target mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mostra apenas datas com pelo menos N horários disponíveis
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div 
          className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-area-bottom"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-1 touch-large"
              disabled={activeCount === 0}
            >
              Limpar Tudo
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 touch-large btn-christmas"
            >
              Aplicar Filtros
              {activeCount > 0 && ` (${activeCount})`}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}