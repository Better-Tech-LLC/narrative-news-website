# narrativeNews.dev — Road to an Award-Winning Product

Stack decision (locked 2026-08-09): **Next.js + TypeScript on Vercel, Supabase backend.**
Firebase is retired; the old static site lives in `legacy/` until we delete it.

## The thesis

A single AI summarizing news is a commodity — every aggregator has one.
**Six models forced to answer the same question independently, with the
disagreement measured and published, is a product.** Everything below serves
that thesis: divergence is the brand, attribution is the trust model, and the
archive is the moat (nobody else keeps score of which model read the moment
right).

## Phase 1 — Redesign & foundation (this week) ✅ mostly done

- [x] Full visual redesign: "morning fog" editorial system, Newsreader/Source
      Serif/Archivo/Spline Mono, six model hues as the only color
- [x] Signature element: the **divergence fingerprint** (six strands, splayed
      by disagreement) on every story card, header, and the wordmark
- [x] New sitemap: front page, story pages, 4 section pages, panel + 6 model
      profile pages, archive, method, newsletter, terms (15+ routes vs. 3)
- [x] Idea upgrade: models become **beats** (Synthesist, Field Reporter,
      Historian, Macro Strategist, Contrarian, Quant) — structured
      disagreement instead of six similar quotes; every story has a **crux**
      question, a consensus read, and a named outlier
- [x] Supabase schema (`supabase/schema.sql`, `nn_` tables) + server-action
      newsletter signup that degrades gracefully without env vars
- [ ] Real logo/favicon + OG images (dynamic per-story with fingerprint)

## Phase 2 — Backend & deploy (next)

- [ ] Apply `supabase/schema.sql` (decide: shared `spa` project with `nn_`
      prefix, like BetterTech.Tech, or a dedicated project)
- [ ] Swap `src/lib/data.ts` read-path to Supabase queries (ISR, revalidate
      on publish)
- [ ] Deploy to Vercel; point narrativenews.dev DNS
- [ ] Newsletter double-opt-in + unsubscribe (Resend or Supabase SMTP)

## Phase 3 — The pipeline (the actual product)

- [ ] Daily generation job: pick 4 stories from wire sources → identical
      brief to all six models (each prompted in its beat) → takes, positions,
      crux, consensus, outlier → write to Supabase → revalidate site
- [ ] Divergence scoring: position extraction per take (model-graded,
      spot-checked), Δ = spread; store history
- [ ] Human review gate before publish (10-minute morning check, not a rewrite)
- [ ] Newsletter render + send from the same issue data

## Phase 4 — The moat features

- [ ] **Scorecards**: when a crux resolves (did the blockade end? did the
      correction deepen?), grade each model's position. Model profile pages
      become track records — this is the feature nobody else can copy without
      our archive
- [ ] **Narrative threads**: follow one story across issues; watch each
      strand drift as the panel updates (the fingerprint becomes a timeline)
- [ ] Divergence alerts: subscribe to "tell me when the panel splits hard on
      anything in Markets"
- [ ] Reader voting: "who read it right?" — engagement loop on the archive

## Phase 5 — Award polish

- [ ] Motion pass: strand-drawing page transitions, scroll-linked fingerprint
      on story pages (respecting reduced-motion)
- [ ] Dynamic OG images (story fingerprint + headline) for share cards
- [ ] Lighthouse ≥ 95 across the board; CWV budget from house rules
- [ ] Full a11y audit (keyboard, contrast on all six hues, screen-reader
      labels for fingerprints)
- [ ] Submit: Awwwards / CSSDA / Godly once the pipeline is live (judges need
      to see it *alive*)

## Monetization (locked 2026-08-09)

Freemium newsletter. **Premium: $8/mo** — (1) briefing arrives 30 minutes
before the free edition, (2) the spoken briefing (TTS audio, one segment per
story) linked inside the email at /listen/[date], (3) full six-take panel +
outlier notes. Audio pipeline: `scripts/generate-audio.mjs` — Gemini TTS when
GEMINI_API_KEY is set, else openai/gpt-audio-mini via OpenRouter (~$2/mo at
daily volume; budget ceiling $9/mo). Send stagger lives in
`scripts/send-newsletter.mjs` (premium batch T+0, `--free-batch` at T+30;
needs RESEND_API_KEY + Stripe for billing — both pending).

Sequence: free daily → 1k subs → sponsor slot → scorecards ship → $8 tier →
Aley crossover funnel on Markets stories. AdSense stays off the product.
