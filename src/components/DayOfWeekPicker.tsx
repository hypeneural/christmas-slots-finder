import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Button } from './ui/button';
import type { DayCode, FilterOption } from '../types';

interface DayOfWeekPickerProps {
  selectedDays: DayCode[];
  onChange: (days: DayCode[]) => void;
  options?: FilterOption<DayCode>[];
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
  selectedDays,
  onChange,
  options
}: DayOfWeekPickerProps) {
  // Ensure value is always an array
  const safeValue = selectedDays || [];
  const displayDays = buildDisplayDays(options, safeValue);

  const handleDayToggle = (days: string[]) => {
    onChange(days as DayCode[]);
  };

  const handleWeekendsToggle = () => {
    if (safeValue.includes('Sat') && safeValue.includes('Sun') && safeValue.length === 2) {
      // If only weekends are selected, clear all
      onChange([]);
    } else {
      // Select only weekends
      onChange(['Sat', 'Sun']);
    }
  };

  const isOnlyWeekends = safeValue.length === 2 && safeValue.includes('Sat') && safeValue.includes('Sun');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Dias da Semana</h4>
        <Button
          variant={isOnlyWeekends ? 'default' : 'outline'}
          size="sm"
          onClick={handleWeekendsToggle}
          className="text-sm h-8 px-3"
        >
          🎉 Só finais de semana
        </Button>
      </div>

      <ToggleGroup
        type="multiple"
        value={safeValue}
        onValueChange={handleDayToggle}
        className="grid grid-cols-7 gap-2"
      >
        {displayDays.map((day) => (
          <ToggleGroupItem
            key={day.code}
            value={day.code}
            aria-label={day.label}
            className="h-10 w-10 text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm transition-all duration-200 hover:bg-muted/50"
          >
            {day.short}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {safeValue.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {safeValue.length} dia{safeValue.length > 1 ? 's' : ''} selecionado{safeValue.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

function buildDisplayDays(
  options: FilterOption<DayCode>[] | undefined,
  selectedDays: DayCode[]
): { code: DayCode; label: string; short: string }[] {
  if (!options?.length) {
    return DAYS;
  }

  const baseByCode = new Map(DAYS.map((day) => [day.code, day]));
  const fromApi = options.map((option) => ({
    code: option.value,
    label: option.label,
    short: baseByCode.get(option.value)?.short ?? option.label.slice(0, 3),
  }));
  const selectedMissing = selectedDays
    .filter((day) => !fromApi.some((option) => option.code === day))
    .map((day) => baseByCode.get(day))
    .filter((day): day is { code: DayCode; label: string; short: string } => Boolean(day));

  return [...fromApi, ...selectedMissing];
}
