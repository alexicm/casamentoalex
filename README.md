# Alex & Paloma · Wedding Experience

Convite digital em aquarela para o casamento em **20 de dezembro de 2026**, a partir das 17h, no **BuGú Delícias**, Taguatinga.

A página pública emociona, informa e converte a visita em confirmação de presença. O painel administrativo revisa respostas sem expor a lista de 50 convidados no front.

## Stack

Next.js App Router · TypeScript · Tailwind CSS · GSAP · Supabase · Zod · Vitest · Playwright

## Como rodar

```bash
cp .env.example .env.local
npm install
npm run dev
```

Sem as chaves do Supabase o convite visual abre normalmente. O formulário avisa que o banco ainda não está ligado e **não finge** que a resposta foi gravada.

## Ligar o banco (RSVP de verdade)

1. Crie um projeto no [Supabase](https://supabase.com).
2. Rode `supabase/migrations/20261029000001_init.sql` no SQL Editor.
3. Preencha `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (somente servidor)
   - `NEXT_PUBLIC_SITE_URL`
4. Rode o seed idempotente:

```bash
npm run seed
```

Isso cria os 50 registros: 19 da Paloma (já confirmados historicamente) e 31 do Alex (pendentes). As duas Carolinas permanecem distintas. Os 14 nomes removidos da lista do Alex não voltam.

5. Crie um usuário em **Authentication > Users**.
6. Insira o `user_id` em `admin_profiles` com `role = 'admin'`.
7. Entre em `/admin/login`.

## Rotas

- `/` convite público
- `/i/[token]` link pessoal assinado (o token bruto nunca é gravado; só o hash)
- `/admin/login` e `/admin/dashboard`
- `/api/rsvp` grava respostas
- `/api/calendar` gera o `.ics`
- `/api/admin/export` CSV com BOM UTF-8 e proteção contra fórmulas

## Segurança

A lista de convidados não é pública. Formulário anônimo cria `rsvp_submissions` em revisão e **não altera** um convidado existente. Homônimos exigem decisão humana. Rate limit, honeypot e RLS bloqueiam leitura anônima de `guests` e `rsvp_submissions`.

A duração no arquivo de calendário é técnica (6h) e **não** divulga horário de encerramento.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run seed
```

## Assets

As aquarelas originais do casal estão em `public/assets/wedding/`. Os moodboards de outros casais ficam em `docs/references/` e não entram no site.
