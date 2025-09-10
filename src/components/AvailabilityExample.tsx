import React, { useState } from 'react';
import { useAvailability } from '../hooks/useAvailability';
import { useApiTest } from '../hooks/useApiTest';
import { QueryFilters, DayCode, PeriodCode } from '../lib/availabilityClient';
import { ApiStatus } from './ApiStatus';
import { isRealApiEnabled } from '../lib/apiConfig';

// ============================================================================
// COMPONENTE DE EXEMPLO
// ============================================================================

export function AvailabilityExample() {
  const [packageCode, setPackageCode] = useState<"HOHOHO" | "ENTAO" | "BOAS">("HOHOHO");
  const [filters, setFilters] = useState<QueryFilters>({
    dateFrom: '2025-11-15',
    dateTo: '2025-12-24',
    onlyWeekends: false,
    onlyAfter18: false,
    minSlotsPerDate: 1,
  });

  const { isLoading: isTestingApi, result: apiTestResult, testApi } = useApiTest();

  const {
    data,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    currentPage,
    totalPages,
    slots,
    packageInfo,
    availableFilters,
    appliedFilters,
    googleCalendar,
    refetch,
    loadMore,
    loadPage,
    clearError,
  } = useAvailability({
    pack: packageCode,
    filters,
  });

  // Handlers
  const handlePackageChange = (newPackage: "HOHOHO" | "ENTAO" | "BOAS") => {
    setPackageCode(newPackage);
  };

  const handleFilterChange = (newFilters: Partial<QueryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleDaysOfWeekChange = (days: DayCode[]) => {
    setFilters(prev => ({ ...prev, daysOfWeek: days }));
  };

  const handleTimeOfDayChange = (periods: PeriodCode[]) => {
    setFilters(prev => ({ ...prev, timeOfDay: periods }));
  };

  const handleOnlyWeekendsChange = (onlyWeekends: boolean) => {
    setFilters(prev => ({ ...prev, onlyWeekends }));
  };

  const handleOnlyAfter18Change = (onlyAfter18: boolean) => {
    setFilters(prev => ({ ...prev, onlyAfter18 }));
  };

  const handleTimeRangeChange = (timeStart?: string, timeEnd?: string) => {
    setFilters(prev => ({ 
      ...prev, 
      timeStart, 
      timeEnd,
      timeOfDay: undefined, // Clear periods when using custom range
    }));
  };

  const handleMinSlotsChange = (minSlotsPerDate: number) => {
    setFilters(prev => ({ ...prev, minSlotsPerDate }));
  };

  // Render helpers
  const renderSlots = () => {
    if (!slots || Object.keys(slots).length === 0) {
      return <p className="text-gray-500">Nenhum horário disponível para os filtros selecionados.</p>;
    }

    return (
      <div className="space-y-4">
        {Object.entries(slots).map(([date, times]) => (
          <div key={date} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">
              {new Date(date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            <div className="flex flex-wrap gap-2">
              {times.map((time) => (
                <span
                  key={time}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPackageInfo = () => {
    if (!packageInfo) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-2">Informações do Pacote</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Código:</span> {packageInfo.code}
          </div>
          <div>
            <span className="font-semibold">Nome:</span> {packageInfo.name}
          </div>
          <div>
            <span className="font-semibold">Duração:</span> {packageInfo.durationMinutes} min
          </div>
          <div>
            <span className="font-semibold">Buffer:</span> {packageInfo.bufferMinutes} min
          </div>
        </div>
      </div>
    );
  };

  const renderFilters = () => {
    if (!availableFilters) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Filtros Disponíveis</h2>
        
        {/* Dias da semana */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Dias da Semana</h3>
          <div className="flex flex-wrap gap-2">
            {availableFilters.daysOfWeek.map((day) => (
              <label key={day.code} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.daysOfWeek?.includes(day.code) || false}
                  onChange={(e) => {
                    const days = filters.daysOfWeek || [];
                    if (e.target.checked) {
                      handleDaysOfWeekChange([...days, day.code]);
                    } else {
                      handleDaysOfWeekChange(days.filter(d => d !== day.code));
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm">
                  {day.label} ({day.slotCount})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Períodos do dia */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Períodos do Dia</h3>
          <div className="flex flex-wrap gap-2">
            {availableFilters.timePeriods.map((period) => (
              <label key={period.code} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.timeOfDay?.includes(period.code) || false}
                  onChange={(e) => {
                    const periods = filters.timeOfDay || [];
                    if (e.target.checked) {
                      handleTimeOfDayChange([...periods, period.code]);
                    } else {
                      handleTimeOfDayChange(periods.filter(p => p !== period.code));
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm">
                  {period.label} ({period.slotCount})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Atalhos */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Atalhos</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.onlyWeekends || false}
                onChange={(e) => handleOnlyWeekendsChange(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">
                Apenas Fins de Semana ({availableFilters.shortcuts.onlyWeekends.slotCount})
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.onlyAfter18 || false}
                onChange={(e) => handleOnlyAfter18Change(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">
                Apenas Após 18h ({availableFilters.shortcuts.onlyAfter18.slotCount})
              </span>
            </label>
          </div>
        </div>

        {/* Range de horário customizado */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Horário Customizado</h3>
          <div className="flex space-x-2">
            <input
              type="time"
              value={filters.timeStart || ''}
              onChange={(e) => handleTimeRangeChange(e.target.value, filters.timeEnd)}
              className="border rounded px-2 py-1"
              placeholder="Início"
            />
            <span className="self-center">até</span>
            <input
              type="time"
              value={filters.timeEnd || ''}
              onChange={(e) => handleTimeRangeChange(filters.timeStart, e.target.value)}
              className="border rounded px-2 py-1"
              placeholder="Fim"
            />
          </div>
        </div>

        {/* Mínimo de slots por data */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Mínimo de Slots por Data</h3>
          <input
            type="number"
            min="1"
            value={filters.minSlotsPerDate || 1}
            onChange={(e) => handleMinSlotsChange(parseInt(e.target.value) || 1)}
            className="border rounded px-2 py-1 w-20"
          />
        </div>
      </div>
    );
  };

  const renderGoogleCalendarInfo = () => {
    if (!googleCalendar) return null;

    return (
      <div className="bg-yellow-50 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-2">Google Calendar</h2>
        <div className="text-sm">
          <p>Eventos ignorados: {googleCalendar.ignoredEvents.length}</p>
          {googleCalendar.hasError && (
            <p className="text-red-600">Erro: {googleCalendar.error}</p>
          )}
          {googleCalendar.ignoredEvents.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">Ver eventos ignorados</summary>
              <ul className="mt-2 space-y-1">
                {googleCalendar.ignoredEvents.map((event) => (
                  <li key={event.id} className="text-xs">
                    {event.summary} ({event.start} - {event.end})
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Exemplo de Uso da API de Disponibilidade</h1>

      {/* Controles */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Controles</h2>
        
        {/* Seleção de pacote */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Pacote:</label>
          <select
            value={packageCode}
            onChange={(e) => handlePackageChange(e.target.value as "HOHOHO" | "ENTAO" | "BOAS")}
            className="border rounded px-3 py-2"
          >
            <option value="HOHOHO">HOHOHO (15min, buffer 60min)</option>
            <option value="ENTAO">ENTAO (30min, buffer 60min)</option>
            <option value="BOAS">BOAS (60min, buffer 120min)</option>
          </select>
        </div>

        {/* Range de datas */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Período:</label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <span className="self-center">até</span>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex space-x-2">
          <button
            onClick={refetch}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
          {hasNextPage && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Carregar Mais
            </button>
          )}
          {isRealApiEnabled() && (
            <button
              onClick={() => testApi(packageCode)}
              disabled={isTestingApi}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {isTestingApi ? 'Testando...' : 'Testar API'}
            </button>
          )}
        </div>
      </div>

      {/* Resultado do teste da API */}
      {apiTestResult && (
        <div className={`rounded-lg p-4 mb-6 ${apiTestResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h2 className={`text-lg font-bold mb-2 ${apiTestResult.success ? 'text-green-800' : 'text-red-800'}`}>
            {apiTestResult.success ? '✅ Teste da API Bem-sucedido' : '❌ Teste da API Falhou'}
          </h2>
          <div className="text-sm">
            <p><strong>Tempo de resposta:</strong> {apiTestResult.responseTime}ms</p>
            {apiTestResult.error && (
              <p className="text-red-600 mt-2"><strong>Erro:</strong> {apiTestResult.error}</p>
            )}
            {apiTestResult.data && (
              <details className="mt-2">
                <summary className="cursor-pointer font-semibold">Ver dados da API</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(apiTestResult.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}

      {/* Informações do pacote */}
      {renderPackageInfo()}

      {/* Filtros disponíveis */}
      {renderFilters()}

      {/* Informações do Google Calendar */}
      {renderGoogleCalendarInfo()}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-bold mb-2">Paginação</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => loadPage(currentPage - 1)}
              disabled={!hasPrevPage || loading}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1 bg-gray-100 rounded">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => loadPage(currentPage + 1)}
              disabled={!hasNextPage || loading}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-red-800 mb-2">Erro</h2>
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={clearError}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Limpar Erro
          </button>
        </div>
      )}

      {/* Slots disponíveis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Horários Disponíveis</h2>
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          renderSlots()
        )}
      </div>

      {/* Status da API */}
      <ApiStatus show={true} />
    </div>
  );
}
