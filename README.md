# 🎄 Fotos de Natal - Agendamento Mobile

Aplicação mobile-first para agendamento de sessões de fotos de Natal, construída com React, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

- **📱 Mobile-first**: Interface otimizada para dispositivos móveis
- **🎯 Multi-pacotes**: Suporte a diferentes tipos de sessões (Ho-Ho-Ho, Então é Natal, Boas Festas)
- **📅 Categorização inteligente**: Horários organizados por categoria (Todos, Após 18h, Sábados, Domingos/Feriados)
- **⏰ Regras de negócio**: Respeita antecedência mínima, conflitos de agenda e durações
- **💬 Integração WhatsApp**: Agendamento direto via WhatsApp
- **💳 Fluxo de pagamento**: Direcionamento para pagamento da entrada
- **🏷️ Tema natalino**: Design system com cores e animações temáticas

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **shadcn/ui** (componentes)
- **date-fns-tz** (manipulação de datas com timezone)
- **React Router** (roteamento)
- **TanStack Query** (gerenciamento de estado)

## 📦 Instalação

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# WhatsApp Integration
VITE_WHATSAPP_NUMBER=5548996425287
VITE_WHATSAPP_URL=https://w.fotosdenatal.com/

# Payment Integration  
VITE_PAYMENT_URL=https://evydencia.com/catalogo/natal

# External Links
VITE_SITE_PACKAGES_URL=https://fotosdenatal.com

# API Configuration (for future use)
VITE_API_BASE_URL=
```

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes shadcn/ui
│   ├── HeaderLogo.tsx
│   ├── TopBanner.tsx
│   ├── PackageInfo.tsx
│   ├── CategoryTabs.tsx
│   ├── DateAccordion.tsx
│   ├── SlotButton.tsx
│   ├── ConfirmDialog.tsx
│   ├── PaymentDialog.tsx
│   ├── WhatsAppFAB.tsx
│   └── Pagination.tsx
├── hooks/              # React hooks customizados
│   └── useAvailability.ts
├── lib/                # Utilitários e regras de negócio
│   ├── scheduling.ts   # Funções puras para agendamento
│   └── i18n.ts        # Strings em português
├── mocks/              # Dados mockados
│   └── availability.json
├── pages/              # Páginas da aplicação
│   ├── PackageSelection.tsx
│   └── SchedulingPage.tsx
├── services/           # Integrações externas
│   └── api.ts         # Preparado para API real
└── types.ts           # Tipos TypeScript
```

### Fluxo de Dados

1. **Mock Data** (`src/mocks/availability.json`) → 
2. **API Service** (`src/services/api.ts`) → 
3. **Hook** (`src/hooks/useAvailability.ts`) → 
4. **Componentes** (processamento via `src/lib/scheduling.ts`)

## 📱 Rotas

- `/` - Seleção de pacotes
- `/:packageSlug` - Horários do pacote (página 1)
- `/:packageSlug/pg/:page` - Horários do pacote (página específica)

## 🎨 Design System

O tema natalino é definido no arquivo `src/index.css` com tokens semânticos:

- **Cores principais**: Verde natalino, vermelho, dourado
- **Gradientes**: Christmas, gold, glow
- **Sombras**: Christmas-themed com glows
- **Animações**: Pulse, transitions suaves

## 🔄 Preparação para API Real

A aplicação está estruturada para facilitar a troca dos dados mockados por uma API real:

1. **Tipos TypeScript**: Contratos bem definidos em `src/types.ts`
2. **Service Layer**: Abstração em `src/services/api.ts`
3. **Variável de ambiente**: `VITE_API_BASE_URL`

### Para integrar com API real:

1. Configure `VITE_API_BASE_URL` no `.env`
2. A função `fetchAvailability()` automaticamente usará a API real
3. O contrato JSON deve seguir a estrutura definida nos tipos

## 🧪 Testes

```bash
# Executar testes
npm run test

# Testes com watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 📋 Regras de Negócio

### Categorização de Horários

- **Todos**: Todos os horários disponíveis
- **Após as 18h**: Segunda a sexta após 18:00
- **Sábados**: Todos os horários de sábado
- **Domingos/Feriados**: Domingos e feriados definidos

### Validações

- ✅ Antecedência mínima (`minAdvanceHours`)
- ✅ Conflitos com eventos ocupados (`busyEvents`)
- ✅ Duração dos eventos para evitar sobreposições
- ✅ Timezone `America/Sao_Paulo`

## 🚀 Deploy

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📄 Licença

Este projeto foi desenvolvido pela equipe Lovable.

---

**Desenvolvido com 💚 para as festas de 2025 🎄**