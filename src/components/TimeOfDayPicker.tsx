import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Clock, Sun, Sunset, Moon } from 'lucide-react';
import type { TimeOfDay } from '../types';

interface TimeOfDayPickerProps {
  timeOfDay: TimeOfDay[];
  onTimeOfDayChange: (times: TimeOfDay[]) => void;
  timeRange?: [string, string];
  onTimeRangeChange: (range: [string, string] | undefined) => void;
  exactTime?: string;
  onExactTimeChange: (time: string | undefined) => void;
  onlyAfter18: boolean;
  onToggleAfter18: (enabled: boolean) => void;
}

const TIME_OPTIONS = [
  { value: 'morning' as TimeOfDay, label: 'Manhã', icon: Sun, time: '06-12h' },
  { value: 'afternoon' as TimeOfDay, label: 'Tarde', icon: Sun, time: '12-18h' },
  { value: 'evening' as TimeOfDay, label: 'Noite', icon: Moon, time: '18-22h' },
];

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function TimeOfDayPicker({
  timeOfDay,
  onTimeOfDayChange,
  timeRange,
  onTimeRangeChange,
  exactTime,
  onExactTimeChange,
  onlyAfter18,
  onToggleAfter18
}: TimeOfDayPickerProps) {
  // Ensure all values are safe
  const safeTimeOfDay = timeOfDay || [];
  const safeTimeRange = timeRange || ['08:00', '18:00'];
  const safeExactTime = exactTime || '';
  const safeOnlyAfter18 = onlyAfter18 || false;

  const [useCustomRange, setUseCustomRange] = useState(!!timeRange);
  const [useExactTime, setUseExactTime] = useState(!!exactTime);

  const sliderValue = safeTimeRange 
    ? [timeToMinutes(safeTimeRange[0]), timeToMinutes(safeTimeRange[1])]
    : [360, 1320]; // 06:00 to 22:00

  const handleTimeOfDayChange = (times: string[]) => {
    onTimeOfDayChange(times as TimeOfDay[]);
  };

  const handleAfter18Toggle = () => {
    if (onlyAfter18) {
      onToggleAfter18(false);
    } else {
      onToggleAfter18(true);
      // Clear conflicting filters
      onTimeOfDayChange([]);
      setUseCustomRange(false);
      onTimeRangeChange(undefined);
      setUseExactTime(false);
      onExactTimeChange(undefined);
    }
  };

  const handleSliderChange = (values: number[]) => {
    const [start, end] = values;
    const startTime = minutesToTime(start);
    const endTime = minutesToTime(end);
    onTimeRangeChange([startTime, endTime]);
  };

  const handleCustomRangeToggle = () => {
    if (useCustomRange) {
      setUseCustomRange(false);
      onTimeRangeChange(undefined);
    } else {
      setUseCustomRange(true);
      // Clear conflicting filters
      onTimeOfDayChange([]);
      onToggleAfter18(false);
      setUseExactTime(false);
      onExactTimeChange(undefined);
    }
  };

  const handleExactTimeToggle = () => {
    if (useExactTime) {
      setUseExactTime(false);
      onExactTimeChange(undefined);
    } else {
      setUseExactTime(true);
      // Clear conflicting filters
      onTimeOfDayChange([]);
      onToggleAfter18(false);
      setUseCustomRange(false);
      onTimeRangeChange(undefined);
    }
  };

  const handleExactTimeChange = (value: string) => {
    if (/^\d{2}:\d{2}$/.test(value)) {
      onExactTimeChange(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Horário</h4>
        <Button
          variant={onlyAfter18 ? 'default' : 'outline'}
          size="sm"
          onClick={handleAfter18Toggle}
          className="text-sm"
        >
          🌙 Após 18h
        </Button>
      </div>

      {/* Time of Day Chips */}
      {!onlyAfter18 && !useCustomRange && !useExactTime && (
        <div>
          <Label className="text-sm text-muted-foreground mb-3 block">Período do dia</Label>
          <ToggleGroup
            type="multiple"
            value={timeOfDay}
            onValueChange={handleTimeOfDayChange}
            className="grid grid-cols-3 gap-2"
          >
            {TIME_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="touch-target flex-col gap-1 p-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{option.label}</span>
                  <span className="text-xs opacity-70">{option.time}</span>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      )}

      {/* Custom Time Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm text-muted-foreground">Faixa personalizada</Label>
          <Button
            variant={useCustomRange ? 'default' : 'outline'}
            size="sm"
            onClick={handleCustomRangeToggle}
            disabled={onlyAfter18 || useExactTime}
          >
            <Clock className="w-3 h-3 mr-1" />
            {useCustomRange ? 'Ativo' : 'Ativar'}
          </Button>
        </div>

        {useCustomRange && (
          <div className="space-y-3">
            <Slider
              value={sliderValue}
              onValueChange={handleSliderChange}
              min={360} // 06:00
              max={1440} // 24:00
              step={30}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{minutesToTime(sliderValue[0])}</span>
              <span>{minutesToTime(sliderValue[1])}</span>
            </div>
          </div>
        )}
      </div>

      {/* Exact Time */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm text-muted-foreground">Hora exata</Label>
          <Button
            variant={useExactTime ? 'default' : 'outline'}
            size="sm"
            onClick={handleExactTimeToggle}
            disabled={onlyAfter18 || useCustomRange}
          >
            🎯 {useExactTime ? 'Ativo' : 'Ativar'}
          </Button>
        </div>

        {useExactTime && (
          <Input
            type="time"
            value={exactTime || ''}
            onChange={(e) => handleExactTimeChange(e.target.value)}
            className="touch-target"
            placeholder="HH:MM"
          />
        )}
      </div>

      {/* Active Filter Summary */}
      {(safeOnlyAfter18 || safeTimeOfDay.length > 0 || useCustomRange || useExactTime) && (
        <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Filtro ativo:</p>
          <p className="text-sm font-medium">
            {safeOnlyAfter18 && '🌙 Após 18h'}
            {safeTimeOfDay.length > 0 && safeTimeOfDay.map(t => 
              TIME_OPTIONS.find(opt => opt.value === t)?.label
            ).join(', ')}
            {useCustomRange && safeTimeRange && `${safeTimeRange[0]} - ${safeTimeRange[1]}`}
            {useExactTime && safeExactTime && `Exato: ${safeExactTime}`}
          </p>
        </div>
      )}
    </div>
  );
}