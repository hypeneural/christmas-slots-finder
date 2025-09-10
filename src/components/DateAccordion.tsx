import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { TimePeriodSection } from './TimePeriodSection';
import { Calendar, Clock, CalendarX, Sparkles, Star } from 'lucide-react';
import { categorizeTimeSlotsByPeriod } from '@/lib/scheduling';

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
        {sortedDates.map((dateStr, index) => {
          const date = parseISO(dateStr);
          const dateLabel = format(date, 'dd/MM', { locale: ptBR });
          const dayLabel = format(date, 'EEEE', { locale: ptBR });
          const times = slots[dateStr];

          return (
            <AccordionItem
              key={dateStr}
              value={dateStr}
              className="native-card border-0 mb-4 animate-slide-up gpu-accelerated group hover:shadow-xl hover:shadow-red-100/20 transition-all duration-300 relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Decoração natalina sutil */}
              <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <Sparkles className="w-4 h-4 text-red-400 animate-twinkle" />
              </div>
              
              {/* Estrelas de fundo */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(2)].map((_, i) => (
                  <Star
                    key={i}
                    className="absolute w-2 h-2 text-yellow-400 opacity-10 animate-twinkle"
                    style={{
                      top: `${30 + i * 40}%`,
                      right: `${10 + i * 20}%`,
                      animationDelay: `${i * 1}s`,
                    }}
                  />
                ))}
              </div>
              <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline transition-all duration-300 hover:bg-primary/3 rounded-t-xl relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 text-left w-full">
                  <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary-glow/20 flex-shrink-0 shadow-sm group-hover:shadow-lg transition-all duration-300 relative">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    {/* Brilho natalino */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full opacity-60 animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:scale-105 transition-transform duration-300">
                      {dateLabel}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground capitalize font-medium">
                      {dayLabel}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 bg-gradient-to-r from-secondary/20 to-secondary/10 px-3 sm:px-4 py-2.5 rounded-xl border border-secondary/10 min-w-0 group-hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
                      <span className="text-xs sm:text-sm font-bold text-secondary">
                        {times.length} Horário{times.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {(() => {
                      const { morning, afternoon, evening } = categorizeTimeSlotsByPeriod(times);
                      const periodInfo = [];
                      if (morning.length > 0) periodInfo.push(`Manhã ${morning.length}`);
                      if (afternoon.length > 0) periodInfo.push(`Tarde ${afternoon.length}`);
                      if (evening.length > 0) periodInfo.push(`Noite ${evening.length}`);
                      
                      return periodInfo.length > 0 && (
                        <div className="text-xs text-muted-foreground text-right leading-tight">
                          {periodInfo.join(' | ')}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="mt-6 space-y-4">
                  {(() => {
                    const { morning, afternoon, evening } = categorizeTimeSlotsByPeriod(times);
                    
                    return (
                      <>
                        <TimePeriodSection
                          period="morning"
                          times={morning}
                          onSlotClick={(time) => onSlotClick(dateStr, time)}
                        />
                        <TimePeriodSection
                          period="afternoon"
                          times={afternoon}
                          onSlotClick={(time) => onSlotClick(dateStr, time)}
                        />
                        <TimePeriodSection
                          period="evening"
                          times={evening}
                          onSlotClick={(time) => onSlotClick(dateStr, time)}
                        />
                      </>
                    );
                  })()}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}