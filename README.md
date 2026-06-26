# PsicoPro

SaaS para profissionais de saúde (psicólogos e clínicas) gerenciarem serviços, horários e agendamentos online.

## Funcionalidades

- Landing pública com listagem de profissionais
- Página pública de agendamento por clínica (`/clinica/[id]`)
- Painel autenticado: dashboard, serviços, perfil, lembretes
- Planos pagos via Stripe (Basic e Professional)
- Período de teste gratuito de 3 dias
- Upload de foto de perfil via Cloudinary

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4, shadcn/ui
- **Backend:** Server Actions, Route Handlers
- **Banco:** PostgreSQL + Prisma 7
- **Auth:** NextAuth v5 (Google + GitHub) — Prisma Adapter com estratégia JWT (ver nota abaixo)
- **Pagamentos:** Stripe Checkout + Webhooks

## Estrutura de pastas

```
src/app/
  (public)/     # Landing, login, agendamento público
  (panel)/      # Dashboard autenticado
  api/          # Route handlers (webhook, upload, appointments)
```

## Setup local

### 1. Clonar e instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha todas as variáveis no `.env`. Gere `AUTH_SECRET` com:

```bash
openssl rand -base64 32
```

### 3. Banco de dados

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 5. Stripe (webhooks locais)

Em outro terminal:

```bash
npm run stripe:listen
```

Copie o webhook signing secret exibido para `STRIPE_WEBHOOK_SECRET` no `.env`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (inclui `prisma generate` e migrations) |
| `npm run start` | Servidor de produção |
| `npm run lint` | Biome linter |
| `npm run test` | Testes unitários (Vitest) |
| `npm run test:e2e` | Testes E2E (Playwright) |
| `npm run stripe:listen` | Encaminha webhooks Stripe para localhost |

## Autenticação (nota técnica)

O projeto usa **Prisma Adapter** para persistir contas OAuth no banco, combinado com **estratégia JWT** para sessões. Os callbacks em `src/lib/auth.ts` resolvem `session.user.id` consultando o banco por `token.sub` ou email, garantindo que o ID do usuário Prisma esteja disponível nas Server Actions.

## Deploy

Recomendado: [Vercel](https://vercel.com). Configure todas as variáveis de ambiente do `.env.example` no painel da Vercel. O build já executa `prisma generate` e `prisma migrate deploy`.

## Licença

Projeto privado — uso em portfólio.
