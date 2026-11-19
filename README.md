# PsicoPro

Agenda online para **psicólogos autônomos**. O profissional cadastra seus serviços e horários, divulga um link próprio e o paciente agenda sozinho, sem precisar criar conta e sem troca de mensagens para combinar horário.

A proposta é ser **mais barato e mais simples** que as grandes plataformas: uma agenda com link próprio, sem marketplace no meio. O foco é psicologia, mas nada impede o uso por outras áreas da saúde.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Planos](#planos)
- [Stack](#stack)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Modelo de dados](#modelo-de-dados)
- [Setup local](#setup-local)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Testes](#testes)
- [CI](#ci)
- [Autenticação](#autenticação-nota-técnica)
- [Design](#design)
- [Deploy](#deploy)

## Funcionalidades

### Área pública
- **Landing** (`/`) com a listagem das clínicas disponíveis. Contas no plano Professional ativo recebem o selo Premium.
- **Página de agendamento** (`/clinica/[id]`): o paciente escolhe o serviço, o dia e um horário livre e informa nome, e-mail e telefone. Não precisa de conta.
- Bloqueio automático de horários já ocupados, de horários passados e de sequências que não comportam a duração do serviço.

### Painel do profissional (`/dashboard`, protegido por middleware)
- **Agendamentos:** lista do dia selecionado, detalhes e cancelamento.
- **Lembretes:** anotações rápidas no painel.
- **Serviços:** criar, editar e excluir, com nome, preço e duração. O limite de serviços depende do plano.
- **Perfil:** foto (upload via Cloudinary), endereço, telefone, fuso horário e horários de atendimento.
- **Planos:** assinatura via Stripe Checkout e gerenciamento pelo Stripe Customer Portal.
- **Link público:** botão para copiar o link de agendamento.

## Planos

Definidos em `src/utils/plans/index.ts`:

| Plano | Preço | Serviços | Agendamentos |
|-------|-------|----------|--------------|
| Basic | R$ 27,90 | até 3 | ilimitados |
| Professional | R$ 97,90 | até 50 | ilimitados |

Toda conta nova tem **3 dias de teste grátis** (`TRIAL_DAYS` em `src/utils/permissions/trial-limits.ts`). O status da assinatura é sincronizado pelo webhook do Stripe (`src/app/api/webhook/route.ts`).

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4, shadcn/ui (Radix), React Hook Form + Zod, TanStack Query, date-fns, Sonner
- **Backend:** Server Actions e Route Handlers
- **Banco:** PostgreSQL + Prisma 7 (adapter `pg`, client gerado em `prisma/generated`)
- **Auth:** NextAuth v5 com Google e GitHub, Prisma Adapter e sessão JWT
- **Pagamentos:** Stripe (Checkout, Customer Portal, Webhooks)
- **Uploads:** Cloudinary
- **Qualidade:** Biome (lint e format), Vitest + Testing Library, Playwright

## Estrutura de pastas

```
prisma/
  schema.prisma        # Modelos do banco
  migrations/          # Migrations versionadas
  generated/           # Prisma Client gerado (não editar)
src/
  app/
    (public)/          # Landing e agendamento público (/clinica/[id])
    (panel)/dashboard/ # Painel: agendamentos, serviços, perfil, planos
    api/               # webhook (Stripe), image/upload, clinic, schedule
  components/ui/       # Componentes shadcn/ui
  env/config.ts        # Validação de CURRENT_ENV e travas de ambiente
  lib/                 # auth, prisma, schemas Zod
  utils/               # permissões, planos, assinatura, formatação
  middleware.ts        # Protege /dashboard/*
e2e/                   # Testes Playwright
```

Convenção usada dentro de cada rota: `_components/` (UI), `_actions/` (Server Actions) e `_data-access/` (consultas ao banco).

## Modelo de dados

| Modelo | Descrição |
|--------|-----------|
| `User` | O profissional: perfil, fuso horário, horários de atendimento (`times`, JSON) e `stripe_customer_id` |
| `Service` | Serviço oferecido. `price` em **centavos**, `duration` em minutos |
| `Appointment` | Agendamento feito pelo paciente (nome, e-mail, telefone, data, horário e serviço). Único por `userId + appointmentDate + time` |
| `Reminder` | Lembrete do painel |
| `Subscription` | Assinatura Stripe (`status`, `plan`: `BASIC` \| `PROFESSIONAL`, `priceId`) |
| `Account`, `Session`, `VerificationToken`, `Authenticator` | Tabelas do NextAuth |

## Setup local

**Pré-requisitos:** Node.js 20+, PostgreSQL, uma conta no Stripe (com a [Stripe CLI](https://stripe.com/docs/stripe-cli)), uma conta no Cloudinary e credenciais OAuth do Google (o GitHub é opcional).

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

O projeto usa um arquivo `.env` por ambiente. Copie o `.env.example` para cada um que for usar:

| Arquivo | Uso | `CURRENT_ENV` |
|---------|-----|---------------|
| `.env.development` | `npm run dev` | `development` |
| `.env.test` | Vitest (`npm run test`) | `test` |
| `.env.e2e` | Playwright | `e2e` |
| `.env.production` | build e start de produção | `production` |

```bash
cp .env.example .env.development
```

`CURRENT_ENV` é obrigatória e validada em `src/env/config.ts`; a aplicação falha se o valor estiver ausente ou for inválido. Gere `AUTH_SECRET` com:

```bash
openssl rand -base64 32
```

### 3. Banco de dados

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Produtos no Stripe

Crie no Stripe dois preços recorrentes (Basic e Professional) e coloque os IDs (`price_...`) em `STRIPE_PLAN_BASIC` e `STRIPE_PLAN_PROFESSIONAL`.

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 6. Webhooks do Stripe

Em outro terminal:

```bash
npm run stripe:listen
```

Copie o signing secret exibido (`whsec_...`) para `STRIPE_WEBHOOK_SECRET`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|:-----------:|-----------|
| `CURRENT_ENV` | ✅ | `development`, `test`, `e2e` ou `production` |
| `DATABASE_URL` | ✅ | Connection string do PostgreSQL |
| `IS_TEST_DATABASE` | só em testes | `"true"` libera a limpeza destrutiva do banco (apenas `.env.test` e `.env.e2e`) |
| `AUTH_SECRET` | ✅ | Segredo do NextAuth |
| `AUTH_URL` | ✅ | URL base da aplicação (ex.: `http://localhost:3000`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | ✅ | OAuth do Google |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | — | OAuth do GitHub (opcional) |
| `STRIPE_SECRET_KEY` | ✅ | Chave secreta do Stripe |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Signing secret do webhook |
| `STRIPE_PLAN_BASIC` / `STRIPE_PLAN_PROFESSIONAL` | ✅ | IDs dos preços de cada plano |
| `STRIPE_SUCCESS_URL` / `STRIPE_CANCEL_URL` | ✅ | Para onde o Checkout redireciona |
| `CLOUDINARY_NAME` / `CLOUDINARY_KEY` / `CLOUDINARY_SECRET` | ✅ | Upload da foto de perfil |
| `NEXT_PUBLIC_URL` | ✅ | URL pública usada nos fetches do client |

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (roda `prisma generate`, `prisma migrate deploy` e `next build`) |
| `npm run start` | Servidor de produção |
| `npm run lint` | Lint com Biome (`src`, `e2e` e configs) |
| `npm run format` | Formata o projeto com Biome |
| `npm run test` | Testes unitários e de integração (Vitest, usando `.env.test`) |
| `npm run test:watch` | Vitest em modo watch |
| `npm run test:cov` | Testes com relatório de cobertura em `coverage/` |
| `npm run stripe:listen` | Encaminha os webhooks do Stripe para `localhost:3000/api/webhook` |

## Testes

### Unitários e integração (Vitest)

Os testes ficam ao lado do código (`*.test.ts`). Cobrem permissões e limites de plano, status de assinatura, o handler do webhook do Stripe, a criação de agendamentos, o bloqueio de horários, schemas Zod e utilitários de formatação.

Os testes de integração usam um **banco real**. O `vitest.global.setup.ts` dá `TRUNCATE` em todas as tabelas antes e depois da suíte, então use um banco **separado** só para testes. Por segurança, essa limpeza só roda quando as duas travas estão ativas:

1. `CURRENT_ENV` é `test` ou `e2e`;
2. `IS_TEST_DATABASE="true"`.

```bash
npm run test
npm run test:cov
```

### E2E (Playwright)

Os testes ficam em `e2e/`. O Playwright sobe o `npm run dev` automaticamente (ou reaproveita um servidor que já esteja rodando):

```bash
npx playwright install chromium   # primeira vez
npx playwright test
```

## CI

O workflow `.github/workflows/ci.yml` roda em push e em pull request para `main` e `master`. Ele instala as dependências, gera o Prisma Client e executa lint, testes e build. As variáveis sensíveis vêm dos secrets do repositório, com valores fictícios como fallback.

## Autenticação (nota técnica)

O projeto usa o **Prisma Adapter** para persistir as contas OAuth no banco, combinado com **estratégia JWT** para as sessões. Os callbacks em `src/lib/auth.ts` resolvem `session.user.id` consultando o banco por `token.sub` ou pelo e-mail, o que garante que o ID do usuário Prisma esteja disponível nas Server Actions. O `src/middleware.ts` protege todas as rotas `/dashboard/*`.

## Design

- [`PRODUCT.md`](PRODUCT.md): público, posicionamento e princípios do produto.
- [`DESIGN.md`](DESIGN.md): sistema visual (tokens de cor, tipografia, componentes e regras). Os tokens ficam em `tailwind.config.ts` e `src/app/globals.css`.

## Deploy

Recomendado: [Vercel](https://vercel.com).

1. Configure no painel da Vercel todas as variáveis da tabela acima, com `CURRENT_ENV=production`.
2. Cadastre o endpoint `https://<seu-domínio>/api/webhook` no Stripe e use o signing secret dele em `STRIPE_WEBHOOK_SECRET`.
3. Atualize `AUTH_URL`, `NEXT_PUBLIC_URL`, as URLs de retorno do Stripe e as URLs de callback do OAuth no Google e no GitHub para o domínio de produção.

O build já executa `prisma generate` e `prisma migrate deploy`.

## Licença

Projeto privado, usado como portfólio.
