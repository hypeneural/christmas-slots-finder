# Integracao com a API publica de agenda do CRM

Data: 2026-05-27

## Objetivo

Adaptar o template React de Natal para consumir a API publica versionada do CRM em:

```text
https://evydencia.com/api/public/v1/agenda
```

Campanha padrao:

```text
natal
```

## Docs oficiais validadas

- Vite env variables: `https://v5.vite.dev/guide/env-and-mode`
- TanStack Query defaults: `https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults`
- React Router route params: `https://reactrouter.com/en/main/hooks/use-params`

## Mudancas aplicadas

- nova camada `src/lib/crmAgendaApi.ts`.
- `src/services/api.ts` agora busca:
  - campanha e pacotes no CRM.
  - disponibilidade em `/campaigns/{campaignSlug}/availability`.
- o front deixou de depender da API PHP `https://horarios.fotosdenatal.com/app.php` para o fluxo principal.
- `.env.example` agora aponta para:

```text
VITE_USE_REAL_API=true
VITE_API_BASE_URL=https://evydencia.com/api/public/v1/agenda
VITE_AGENDA_CAMPAIGN_SLUG=natal
```

## Contrato consumido

Campanha:

```text
GET /campaigns/{campaignSlug}
```

Disponibilidade:

```text
GET /campaigns/{campaignSlug}/availability
```

Parametros usados:

- `package`
- `dateFrom`
- `dateTo`
- `page`
- `perPage`
- `daysOfWeek`
- `onlyWeekends`
- `onlyHolidays`
- `timeOfDay`
- `timeStart`
- `timeEnd`
- `onlyAfter18`
- `exactTime`
- `minSlotsPerDate`

## Melhorias ainda recomendadas no React

1. [x] Remover componentes de teste/debug expostos por rota (`/test-api`, `/simple-test`, `/validation-test`) antes de publicar em producao.
2. [x] Trocar o modo `/pg` por `customerFlow.mode` vindo do CRM.
3. [x] Expor o filtro `onlyHolidays` na UI quando `filters.available.hasHolidays=true`.
4. [x] Expor selects a partir de `filters.available.daysOfWeekOptions`, `timePeriodOptions`, `times` e `holidayDates`.
5. [ ] Trocar `window.location.reload()` no pull-to-refresh por refetch real do hook.
6. [ ] Usar TanStack Query de fato para cache/refetch de campanha e disponibilidade, ou remover `QueryClientProvider` se continuar com estado manual.
7. [ ] Revisar textos restantes com encoding antigo em arquivos legados nao renderizados no fluxo principal.
8. [x] Aplicar code splitting; o build deixou de gerar aviso de bundle JS acima de 500 kB.

## Validacoes executadas

```bash
npm ci
npx vitest run
npm run build
npm audit --omit=dev
```

Resultado:

- 2026-05-27: testes `4 passed`, `27 passed`; build Vite `5.4.21`; audit ainda apontava `vite/esbuild`.
- 2026-05-28: testes `5 passed`, `29 passed`; lint ok; audit `0 vulnerabilities`; build Vite `8.0.14` com chunks abaixo de 500 kB.

## Checklist de deploy do React

- configurar variaveis de build:
  - `VITE_USE_REAL_API=true`
  - `VITE_API_BASE_URL=https://evydencia.com/api/public/v1/agenda`
  - `VITE_AGENDA_CAMPAIGN_SLUG=natal`
  - `VITE_PAYMENT_URL=https://evydencia.com/catalogo/natal`
  - `VITE_WHATSAPP_URL=...`
- confirmar que a campanha `natal` esta publicada no CRM.
- confirmar que os produtos da campanha usam os slugs esperados pelo front.
- confirmar CORS do CRM para o dominio onde o React sera publicado.
- rodar `npm run build`.
- publicar a pasta `dist`.
- abrir o dominio final e testar:
  - selecao de pacote.
  - disponibilidade.
  - filtros.
  - CTA de WhatsApp/pagamento.
