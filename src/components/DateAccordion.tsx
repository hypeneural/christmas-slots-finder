import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { SlotButton } from './SlotButton';
import { Calendar, Clock } from 'lucide-react';

interface DateAccordionProps {
  slots: Record<string, string[]>;
  onSlotClick: (date: string, time: string) => void;
}

export function DateAccordion({ slots, onSlotClick }: DateAccordionProps) {
  const sortedDates = Object.keys(slots).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Nenhum horário disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Accordion type="multiple" className="w-full space-y-2">
        {sortedDates.map((dateStr) => {
          const date = parseISO(dateStr);
          const dateLabel = format(date, 'dd/MM', { locale: ptBR });
          const dayLabel = format(date, 'EEEE', { locale: ptBR });
          const times = slots[dateStr];

          return (
            <AccordionItem
              key={dateStr}
              value={dateStr}
              className="border border-border/50 rounded-lg bg-card/30 backdrop-blur"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">
                      {dateLabel}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {dayLabel}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{times.length} horários</span>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-3 mt-2">
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