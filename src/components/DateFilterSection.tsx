import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar, CalendarDays } from 'lucide-react';
import { format, addDays, startOfDay } from 'date-fns';

interface DateFilterSectionProps {
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange: (date: string | undefined) => void;
  onDateToChange: (date: string | undefined) => void;
}

export function DateFilterSection({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange
}: DateFilterSectionProps) {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);

  const dateShortcuts = [
    { 
      label: 'Hoje', 
      date: format(today, 'yyyy-MM-dd'),
      icon: '📅'
    },
    { 
      label: 'Amanhã', 
      date: format(tomorrow, 'yyyy-MM-dd'),
      icon: '📆'
    },
    { 
      label: 'Próximos 7 dias', 
      date: format(nextWeek, 'yyyy-MM-dd'),
      icon: '🗓️'
    },
  ];

  const handleShortcutClick = (date: string) => {
    onDateFromChange(date);
    onDateToChange(undefined);
  };

  const handleClearDates = () => {
    onDateFromChange(undefined);
    onDateToChange(undefined);
  };

  const hasDateFilter = dateFrom || dateTo;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Filtros de Data</h3>
        {hasDateFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearDates}
            className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
          >
            Limpar
          </Button>
        )}
      </div>

      {/* Date Shortcuts */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Atalhos rápidos</Label>
        <div className="grid grid-cols-3 gap-2">
          {dateShortcuts.map((shortcut) => (
            <Button
              key={shortcut.label}
              variant={dateFrom === shortcut.date ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleShortcutClick(shortcut.date)}
              className="h-10 flex-col gap-1 text-xs"
            >
              <span className="text-base">{shortcut.icon}</span>
              <span className="font-medium">{shortcut.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Date Range Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateFrom" className="text-sm font-medium">
            Data inicial
          </Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom || ''}
            onChange={(e) => onDateFromChange(e.target.value || undefined)}
            className="h-10 text-base"
            min={format(today, 'yyyy-MM-dd')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateTo" className="text-sm font-medium">
            Data final
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo || ''}
            onChange={(e) => onDateToChange(e.target.value || undefined)}
            className="h-10 text-base"
            min={dateFrom || format(today, 'yyyy-MM-dd')}
          />
        </div>
      </div>

      {/* Active Date Filter Summary */}
      {hasDateFilter && (
        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Filtro de data ativo:</p>
          <p className="text-sm font-medium">
            {dateFrom && `De: ${format(new Date(dateFrom), 'dd/MM/yyyy')}`}
            {dateFrom && dateTo && ' • '}
            {dateTo && `Até: ${format(new Date(dateTo), 'dd/MM/yyyy')}`}
          </p>
        </div>
      )}
    </div>
  );
}
