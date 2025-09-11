import { useState } from 'react';
import { Button } from './ui/button';
import { TouchFriendlyFiltersModal } from './TouchFriendlyFiltersModal';
import { Filter, Settings, Sparkles } from 'lucide-react';
import type { Filters } from '@/types';

export function FiltersModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    dateFrom: '',
    dateTo: '',
    timeOfDay: [],
    timeRange: ['08:00', '18:00'],
    exactTime: '',
    onlyAfter18: false,
    daysOfWeek: []
  });

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      timeOfDay: [],
      timeRange: ['08:00', '18:00'],
      exactTime: '',
      onlyAfter18: false,
      daysOfWeek: []
    });
  };

  const activeCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return Object.values(value).some(v => v !== '08:00' && v !== '18:00');
    return value !== '' && value !== 'any' && value !== false;
  }).length;

  return (
    <div className="p-6 space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Modal de Filtros Touch-Friendly</h2>
        <p className="text-muted-foreground">
          Teste o novo modal de filtros com design moderno e touch-friendly
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-full h-14 text-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground"
        >
          <Filter className="w-5 h-5 mr-2" />
          Testar Modal de Filtros
        </Button>
        
        <div className="bg-muted/20 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Funcionalidades:
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Filtros por data e período</li>
            <li>• Seleção de dias da semana</li>
            <li>• Filtros por horário</li>
            <li>• Atalhos de data rápida</li>
            <li>• Puxar para baixo para fechar</li>
            <li>• Feedback tátil nativo</li>
            <li>• Design responsivo e moderno</li>
          </ul>
        </div>

        {activeCount > 0 && (
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary">
                {activeCount} filtro{activeCount !== 1 ? 's' : ''} ativo{activeCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      <TouchFriendlyFiltersModal
        open={isOpen}
        onOpenChange={setIsOpen}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
