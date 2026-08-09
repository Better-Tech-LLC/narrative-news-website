# narrativeNews.dev

Daily news analyzed by a panel of six AI models. Every take attributed.
**Where the panel diverges is the story.**

## Stack

- Next.js (App Router) + TypeScript, deployed on **Vercel**
- **Supabase** backend (`supabase/schema.sql`, `nn_` prefixed tables)
- Seed content lives in `src/lib/data.ts` until the daily pipeline is wired

## Develop

```bash
npm install
npm run dev   # http://localhost:3001
```

Runs fully without env vars; copy `.env.example` to `.env.local` to wire
Supabase.

## Layout

- `src/lib/` — types, panel definitions (models + beats), seed content,
  Supabase client
- `src/components/` — masthead, ticker, story cards, the Strands divergence
  fingerprint, take list, newsletter form
- `src/app/` — routes: `/`, `/story/[slug]`, `/section/[slug]`, `/models`,
  `/models/[slug]`, `/archive`, `/about`, `/newsletter`, `/terms`
- `legacy/` — the retired Firebase static site
- `PLAN.md` — product roadmap

## Design system

Cool fog-white canvas, ink-navy text; the only color is the six model hues.
Type: Newsreader (display), Source Serif 4 (body), Archivo (UI), Spline Sans
Mono (data). Signature: the divergence fingerprint — six strands, parallel in
agreement, splayed in dissent.
