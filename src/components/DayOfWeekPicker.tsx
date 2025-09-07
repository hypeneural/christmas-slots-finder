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
  const handleDayToggle = (days: string[]) => {
    onChange(days as DayCode[]);
  };

  const handleWeekendsToggle = () => {
    if (onlyWeekends) {
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
          variant={onlyWeekends ? 'default' : 'outline'}
          size="sm"
          onClick={handleWeekendsToggle}
          className="text-sm"
        >
          🎉 Só finais de semana
        </Button>
      </div>

      <ToggleGroup
        type="multiple"
        value={onlyWeekends ? ['Sat', 'Sun'] : value}
        onValueChange={handleDayToggle}
        disabled={onlyWeekends}
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

      {value.length > 0 && !onlyWeekends && (
        <p className="text-xs text-muted-foreground">
          {value.length} dias selecionados
        </p>
      )}
    </div>
  );
}