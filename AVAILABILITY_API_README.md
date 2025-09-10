# API de Disponibilidade de Horários de Natal

SDK robusto para consumir a API de disponibilidade de horários de Natal com TypeScript, validação Zod e hooks React.

## 🚀 Instalação

```bash
npm install zod
# ou
yarn add zod
```

## 📋 Recursos

- ✅ **Tipos TypeScript** completos para request e response
- ✅ **Validação Zod** robusta da resposta da API
- ✅ **Cliente HTTP** com métodos GET e POST
- ✅ **Hook React** com cache e paginação
- ✅ **Conversão automática** de arrays para CSV
- ✅ **Tratamento de erros** e timeout
- ✅ **Cache inteligente** com TTL configurável
- ✅ **Paginação** automática e manual
- ✅ **AbortSignal** para cancelamento de requisições

## 🏗️ Estrutura

```
src/
├── lib/
│   ├── availabilityClient.ts     # SDK principal
│   └── __tests__/
│       └── availabilityClient.test.ts
├── hooks/
│   └── useAvailability.ts        # Hook React
├── components/
│   └── AvailabilityExample.tsx   # Exemplo de uso
└── pages/
    └── api/
        └── availability.ts       # API route Next.js
```

## 🔧 Uso Básico

### Cliente HTTP

```typescript
import { AvailabilityClient } from './lib/availabilityClient';

const client = new AvailabilityClient();

// GET simples
const data = await client.getAvailability('HOHOHO');

// GET com filtros
const filteredData = await client.getAvailability('ENTAO', {
  dateFrom: '2025-11-15',
  dateTo: '2025-12-24',
  onlyWeekends: false,
  onlyAfter18: true,
  daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  timeStart: '18:00',
  timeEnd: '20:00',
  minSlotsPerDate: 1,
  page: 1,
  perPage: 30,
});

// POST com body JSON
const postData = await client.postAvailability('BOAS', {
  filters: {
    request: {
      applied: {
        dateRange: { from: '2025-10-01', to: '2025-11-14' },
        daysOfWeek: { enabled: true, days: ['Saturday', 'Sunday'] },
        timeRange: { 
          enabled: true, 
          type: 'periods', 
          periods: ['morning', 'afternoon'] 
        },
        availability: { minSlotsPerDate: 1 }
      },
      pagination: { page: 1, perPage: 30 }
    }
  }
});
```

### Hook React

```typescript
import { useAvailability } from './hooks/useAvailability';

function MyComponent() {
  const {
    data,
    loading,
    error,
    hasNextPage,
    slots,
    packageInfo,
    refetch,
    loadMore,
  } = useAvailability({
    pack: 'HOHOHO',
    filters: {
      dateFrom: '2025-11-15',
      dateTo: '2025-12-24',
      onlyAfter18: true,
    },
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>{packageInfo?.name}</h1>
      <div>
        {Object.entries(slots).map(([date, times]) => (
          <div key={date}>
            <h3>{date}</h3>
            {times.map(time => (
              <span key={time}>{time}</span>
            ))}
          </div>
        ))}
      </div>
      {hasNextPage && (
        <button onClick={loadMore}>Carregar Mais</button>
      )}
    </div>
  );
}
```

## 📚 Exemplos Detalhados

### 1. GET Mínimo

```bash
curl -s 'https://horarios.fotosdenatal.com/app.php?pack=HOHOHO'
```

```typescript
const data = await client.getAvailability('HOHOHO');
```

### 2. GET com Filtros Completos

```bash
curl -s 'https://horarios.fotosdenatal.com/app.php?pack=ENTAO&tz=America/Sao_Paulo&dateFrom=2025-11-15&dateTo=2025-12-24&onlyWeekends=false&onlyAfter18=true&daysOfWeek=Monday,Tuesday,Wednesday,Thursday,Friday&timeStart=18:00&timeEnd=20:00&minSlotsPerDate=1&page=1&perPage=30'
```

```typescript
const data = await client.getAvailability('ENTAO', {
  tz: 'America/Sao_Paulo',
  dateFrom: '2025-11-15',
  dateTo: '2025-12-24',
  onlyWeekends: false,
  onlyAfter18: true,
  daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  timeStart: '18:00',
  timeEnd: '20:00',
  minSlotsPerDate: 1,
  page: 1,
  perPage: 30,
});
```

### 3. POST com Body JSON

```bash
curl -s -X POST 'https://horarios.fotosdenatal.com/app.php?pack=BOAS' \
  -H 'Content-Type: application/json' \
  -d '{
    "filters": {
      "request": {
        "applied": {
          "dateRange": { "from": "2025-10-01", "to": "2025-11-14", "timezone": "America/Sao_Paulo" },
          "daysOfWeek": { "enabled": true, "days": ["Saturday","Sunday"], "shortcuts": { "onlyWeekends": true } },
          "timeRange": { "enabled": true, "type": "periods", "periods": ["morning","afternoon"], "shortcuts": { "onlyAfter18": false } },
          "availability": { "minSlotsPerDate": 1 }
        },
        "pagination": { "page": 1, "perPage": 30 }
      }
    }
  }'
```

```typescript
const data = await client.postAvailability('BOAS', {
  filters: {
    request: {
      applied: {
        dateRange: { 
          from: '2025-10-01', 
          to: '2025-11-14', 
          timezone: 'America/Sao_Paulo' 
        },
        daysOfWeek: { 
          enabled: true, 
          days: ['Saturday', 'Sunday'], 
          shortcuts: { onlyWeekends: true } 
        },
        timeRange: { 
          enabled: true, 
          type: 'periods', 
          periods: ['morning', 'afternoon'], 
          shortcuts: { onlyAfter18: false } 
        },
        availability: { minSlotsPerDate: 1 }
      },
      pagination: { page: 1, perPage: 30 }
    }
  }
});
```

### 4. Uso no Backend (Node/Next API Route)

```typescript
// pages/api/availability.ts
import { AvailabilityClient } from '@/lib/availabilityClient';

const client = new AvailabilityClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pack = searchParams.get('pack');
  
  if (!pack) {
    return Response.json({ error: 'Package required' }, { status: 400 });
  }

  const filters = {
    dateFrom: searchParams.get('dateFrom') || undefined,
    dateTo: searchParams.get('dateTo') || undefined,
    onlyAfter18: searchParams.get('onlyAfter18') === 'true',
    // ... outros filtros
  };

  try {
    const data = await client.getAvailability(pack, filters);
    
    return Response.json(data, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    return Response.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}
```

### 5. Hook com Paginação

```typescript
function AvailabilityList() {
  const {
    data,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    currentPage,
    totalPages,
    loadMore,
    loadPage,
  } = useAvailability({
    pack: 'HOHOHO',
    filters: { onlyAfter18: true },
  });

  return (
    <div>
      {/* Lista de horários */}
      <div>
        {Object.entries(data?.processedSlots.all || {}).map(([date, times]) => (
          <div key={date}>
            <h3>{date}</h3>
            {times.map(time => (
              <span key={time}>{time}</span>
            ))}
          </div>
        ))}
      </div>

      {/* Controles de paginação */}
      <div>
        <button 
          onClick={() => loadPage(currentPage - 1)}
          disabled={!hasPrevPage}
        >
          Anterior
        </button>
        
        <span>Página {currentPage} de {totalPages}</span>
        
        <button 
          onClick={() => loadPage(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Próxima
        </button>
        
        {hasNextPage && (
          <button onClick={loadMore}>
            Carregar Mais
          </button>
        )}
      </div>
    </div>
  );
}
```

### 6. Buscar Todas as Páginas

```typescript
import { useAllAvailability } from './hooks/useAvailability';

function AllAvailability() {
  const { data, loading, error } = useAllAvailability({
    pack: 'HOHOHO',
    filters: { onlyWeekends: true },
  });

  if (loading) return <div>Carregando todas as páginas...</div>;
  if (error) return <div>Erro: {error}</div>;

  // data é um array com todas as páginas
  const allSlots = data.reduce((acc, page) => ({
    ...acc,
    ...page.processedSlots.all,
  }), {});

  return (
    <div>
      {Object.entries(allSlots).map(([date, times]) => (
        <div key={date}>
          <h3>{date}</h3>
          {times.map(time => (
            <span key={time}>{time}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## 🎯 Filtros Disponíveis

### Query Parameters (GET)

| Parâmetro | Tipo | Exemplo | Descrição |
|-----------|------|---------|-----------|
| `pack`* | `string` | `HOHOHO` | Código do pacote (obrigatório) |
| `tz` | `string` | `America/Sao_Paulo` | Timezone (default: America/Sao_Paulo) |
| `page` | `number` | `1` | Página (default: 1) |
| `perPage` | `number` | `30` | Itens por página (default: 30) |
| `dateFrom` | `string` | `2025-11-15` | Data inicial (YYYY-MM-DD) |
| `dateTo` | `string` | `2025-12-24` | Data final (YYYY-MM-DD) |
| `daysOfWeek` | `string` | `Monday,Tuesday,Friday` | Dias da semana (CSV) |
| `onlyWeekends` | `boolean` | `true` | Apenas fins de semana |
| `timeOfDay` | `string` | `morning,evening` | Períodos do dia (CSV) |
| `timeStart` | `string` | `09:00` | Horário inicial (HH:MM) |
| `timeEnd` | `string` | `18:00` | Horário final (HH:MM) |
| `onlyAfter18` | `boolean` | `true` | Apenas após 18h |
| `exactTime` | `string` | `14:00` | Horário exato (HH:MM) |
| `minSlotsPerDate` | `number` | `2` | Mínimo de slots por data |

### Body JSON (POST)

```typescript
{
  "filters": {
    "request": {
      "packageSlug": "ENTAO", // opcional; pack via query tem precedência
      "applied": {
        "dateRange": { 
          "from": "2025-11-15", 
          "to": "2025-12-24", 
          "timezone": "America/Sao_Paulo" 
        },
        "daysOfWeek": { 
          "enabled": true, 
          "days": ["Monday","Tuesday"], 
          "shortcuts": { "onlyWeekends": false } 
        },
        "timeRange": {
          "enabled": true,
          "type": "custom", // "custom" | "preset" | "periods"
          "start": "09:00",
          "end": "18:00",
          "periods": ["morning","afternoon"],
          "shortcuts": { "onlyAfter18": false, "businessHours": true }
        },
        "availability": { 
          "minSlotsPerDate": 1, 
          "exactTime": null 
        }
      },
      "pagination": { "page": 1, "perPage": 30 }
    }
  }
}
```

## 📦 Pacotes Disponíveis

| Código | Nome | Duração | Buffer | Observações |
|--------|------|---------|--------|-------------|
| `HOHOHO` | Pacote HOHOHO | 15 min | 60 min | Sem domingo/feriado, sábado só manhã |
| `ENTAO` | Pacote ENTAO | 30 min | 60 min | Disponível todos os dias |
| `BOAS` | Pacote BOAS | 60 min | 120 min | Disponível todos os dias |

## 🔧 Configuração Avançada

### Cliente Personalizado

```typescript
const client = new AvailabilityClient({
  baseUrl: 'https://api.exemplo.com/availability',
  timeoutMs: 30000,
  defaultTZ: 'America/New_York',
});
```

### Hook com Cache Personalizado

```typescript
const { data, loading, error } = useAvailability({
  pack: 'HOHOHO',
  filters: { onlyAfter18: true },
  enabled: true,
  client: customClient,
  cacheKey: 'custom-key',
});
```

### Tratamento de Erros

```typescript
try {
  const data = await client.getAvailability('HOHOHO');
  // Sucesso
} catch (error) {
  if (error.message.includes('timeout')) {
    // Tratar timeout
  } else if (error.message.includes('API Error')) {
    // Tratar erro da API
  } else {
    // Tratar outros erros
  }
}
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes com coverage
npm run test:coverage
```

## 📝 Notas de Regra de Negócio

- **Pacotes**: HOHOHO (15min, buffer 60), ENTAO (30min, buffer 60), BOAS (60min, buffer 120)
- **Caps**: sáb/dom/feriados cortam horários até 17:00
- **Lead time**: respeita `min_advance_hours` por período
- **Google Calendar**: ignora eventos cujo `summary` começa com `p-`, `P-` ou `[p]`
- **Conflitos**: consideram duração + buffer quando `blockWithBuffer` é `true`

## 🚀 Performance

- **Cache**: TTL de 5 minutos por padrão
- **Paginação**: Carregamento incremental
- **AbortSignal**: Cancelamento de requisições
- **Timeout**: 15 segundos por padrão
- **Headers**: Cache-Control sugerido para SSR

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.
