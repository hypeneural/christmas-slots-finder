import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { SlotButton } from './SlotButton';
import { Calendar, Clock, CalendarX } from 'lucide-react';

interface DateAccordionProps {
  slots: Record<string, string[]>;
  onSlotClick: (date: string, time: string) => void;
}

export function DateAccordion({ slots, onSlotClick }: DateAccordionProps) {
  const sortedDates = Object.keys(slots).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="p-4 rounded-full bg-muted/20 w-fit mx-auto mb-4">
          <CalendarX className="w-8 h-8" />
        </div>
        <p className="text-lg">Nenhum horário disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full space-y-3">
        {sortedDates.map((dateStr) => {
          const date = parseISO(dateStr);
          const dateLabel = format(date, 'dd/MM', { locale: ptBR });
          const dayLabel = format(date, 'EEEE', { locale: ptBR });
          const times = slots[dateStr];

          return (
            <AccordionItem
              key={dateStr}
              value={dateStr}
              className="app-card border-border/30"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline transition-all duration-200 hover:bg-primary/5">
                <div className="flex items-center gap-4 text-left w-full">
                  <div className="p-3 rounded-full bg-primary/20 flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-foreground">
                      {dateLabel}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize font-medium">
                      {dayLabel}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/20 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-semibold text-secondary">
                      {times.length} horário{times.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {times.map((time) => (
                    <SlotButton
                      key={time}
                      time={time}
                      onClick={() => onSlotClick(dateStr, time)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}