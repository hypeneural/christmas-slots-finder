import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Button } from './ui/button';
import type { DayCode } from '../types';

interface DayOfWeekPickerProps {
  value: DayCode[];
  onChange: (days: DayCode[]) => void;
  onlyWeekends: boolean;
  onToggleWeekends: (enabled: boolean) => void;
}

const DAYS: { code: DayCode; label: string; short: string }[] = [
  { code: 'Sun', label: 'Domingo', short: 'Dom' },
  { code: 'Mon', label: 'Segunda', short: 'Seg' },
  { code: 'Tue', label: 'Terça', short: 'Ter' },
  { code: 'Wed', label: 'Quarta', short: 'Qua' },
  { code: 'Thu', label: 'Quinta', short: 'Qui' },
  { code: 'Fri', label: 'Sexta', short: 'Sex' },
  { code: 'Sat', label: 'Sábado', short: 'Sáb' },
];

export function DayOfWeekPicker({
  value,
  onChange,
  onlyWeekends,
  onToggleWeekends
}: DayOfWeekPickerProps) {
  // Ensure value is always an array
  const safeValue = value || [];
  const safeOnlyWeekends = onlyWeekends || false;

  const handleDayToggle = (days: string[]) => {
    onChange(days as DayCode[]);
  };

  const handleWeekendsToggle = () => {
    if (safeOnlyWeekends) {
      onToggleWeekends(false);
      onChange([]);
    } else {
      onToggleWeekends(true);
      onChange(['Sat', 'Sun']);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Dia da semana</h4>
        <Button
          variant={safeOnlyWeekends ? 'default' : 'outline'}
          size="sm"
          onClick={handleWeekendsToggle}
          className="text-sm"
        >
          🎉 Só finais de semana
        </Button>
      </div>

      <ToggleGroup
        type="multiple"
        value={safeOnlyWeekends ? ['Sat', 'Sun'] : safeValue}
        onValueChange={handleDayToggle}
        disabled={safeOnlyWeekends}
        className="grid grid-cols-7 gap-1"
      >
        {DAYS.map((day) => (
          <ToggleGroupItem
            key={day.code}
            value={day.code}
            aria-label={day.label}
            className="touch-target text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {day.short}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {safeValue.length > 0 && !safeOnlyWeekends && (
        <p className="text-xs text-muted-foreground">
          {safeValue.length} dias selecionados
        </p>
      )}
    </div>
  );
}