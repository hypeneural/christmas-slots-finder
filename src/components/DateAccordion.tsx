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
              className="native-card border-0 mb-4"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline transition-all duration-300 hover:bg-primary/3 rounded-t-xl">
                <div className="flex items-center gap-4 text-left w-full">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-glow/20 flex-shrink-0 shadow-sm">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-foreground mb-1">
                      {dateLabel}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize font-medium">
                      {dayLabel}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-secondary/20 to-secondary/10 px-4 py-2 rounded-full border border-secondary/10">
                    <Clock className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-semibold text-secondary">
                      {times.length}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-4 mt-6">
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