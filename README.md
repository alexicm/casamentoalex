# Alex & Paloma · Wedding Experience

Convite digital em aquarela para o casamento em **20 de dezembro de 2026**, a partir das 17h, no **BuGú Delícias**, Taguatinga, Brasília/DF.

A primeira dobra é um envelope selado. Depois, a página informa, inspira o look e converte a visita em confirmação real. Sem Supabase, o formulário **não finge** que a resposta foi gravada.

## Stack

Next.js App Router · TypeScript · Tailwind CSS · GSAP · Lenis · Supabase · Zod · Vitest · Playwright

## Como rodar

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Ligar o banco (RSVP de verdade)

1. Crie um projeto no [Supabase](https://supabase.com).
2. Rode as migrations em `supabase/migrations/` no SQL Editor (a ordem do nome).
3. Preencha `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (somente servidor)
   - `NEXT_PUBLIC_SITE_URL`
4. Rode `npm run seed`
5. Crie um usuário em Authentication e registre o `user_id` em `admin_profiles`.
6. Entre em `/admin/login`.

O seed cria 50 registros: 19 da Paloma (histórico) e 31 do Alex (pendentes). Carolina Abreu, Carolina Fonseca, João Victor e João Victor Freitas permanecem distintos.

## Rotas

- `/` convite público, com envelope de abertura
- `/convite?t=` e `/i/[token]` link pessoal (só o hash fica no banco)
- `/obrigado` e `/obrigado/ausencia` após gravação, com recibo opaco `?r=`
- `/admin/login` e `/admin/dashboard`
- `/api/rsvp` e `/api/calendar`

## Endereço e calendário

O site público mostra **BuGú Delícias, Taguatinga, Brasília/DF**. O endereço de rua fica no painel para validação antes de publicar. O `.ics` usa duração técnica de 6h, documentada aqui, sem anunciar horário de encerramento.

## Motion

GSAP e ScrollTrigger são registrados uma vez em `lib/gsap.ts`. Lenis usa o ticker do GSAP. `prefers-reduced-motion` desliga parallax, envelope 3D e magnetismo. SplitText e Flip vêm do pacote público `gsap`. Sem Lottie e sem Matter.js.

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
