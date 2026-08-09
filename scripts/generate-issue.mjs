// Daily issue pipeline: research today's stories → six-model panel takes →
// divergence scores → nano banana art → writes src/lib/generated.ts.
// Usage: node scripts/generate-issue.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const KEY = process.env.OPENROUTER_API_KEY;
if (!KEY) throw new Error("OPENROUTER_API_KEY missing");

const OR = "https://openrouter.ai/api/v1/chat/completions";
const HEADERS = {
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://narrativenews.dev",
  "X-Title": "narrativeNews.dev",
};

/** The panel: model id → OpenRouter slug candidates (first available wins) + beat prompt. */
const PANEL = [
  { id: "claude", name: "Claude", slugs: ["anthropic/claude-sonnet-4.6", "anthropic/claude-sonnet-4.5", "anthropic/claude-sonnet-4"], beat: "The Synthesist", voice: "You weigh second-order effects and connect stories others treat as separate. You hedge exactly as much as the evidence hedges — state uncertainty explicitly." },
  { id: "llama-scout", name: "Llama 4 Scout", slugs: ["meta-llama/llama-4-scout"], beat: "The Field Reporter", voice: "You stick to what is verifiable on the ground: counts, filings, confirmed numbers. You distrust narrative until the numbers arrive, and you say so bluntly." },
  { id: "llama-70b", name: "Llama 3.3 70B", slugs: ["meta-llama/llama-3.3-70b-instruct"], beat: "The Historian", voice: "You anchor every story to its nearest historical analog and base rates. You are suspicious of 'this time is different' arguments." },
  { id: "qwen", name: "Qwen 3", slugs: ["qwen/qwen3-235b-a22b-2507", "qwen/qwen3-235b-a22b", "qwen/qwen3-32b"], beat: "The Macro Strategist", voice: "You read stories through trade flows, supply chains, and capital, weighting Asia-Pacific signals Western coverage underweights. Follow the money before the statements." },
  { id: "kimi", name: "Kimi K2", slugs: ["moonshotai/kimi-k2-0905", "moonshotai/kimi-k2"], beat: "The Contrarian", voice: "You are paid to disagree. Stress-test the obvious consensus reading of this story and argue the strongest opposing case — without being contrarian about verifiable facts." },
  { id: "gpt-oss", name: "GPT-OSS 120B", slugs: ["openai/gpt-oss-120b"], beat: "The Quant", voice: "Numbers first. Convert the story into probabilities, prices, and expected value. State confidence as a number, never an adverb." },
];

const RESEARCH_SLUGS = ["perplexity/sonar-pro", "perplexity/sonar", "openai/gpt-5-mini:online"];
const WRITER_SLUGS = PANEL[0].slugs;
const IMAGE_MODELS = ["google/gemini-3.1-flash-image", "google/gemini-3-pro-image"];

async function chat(slugs, messages, { maxTokens = 4000, retries = 2 } = {}) {
  let lastErr;
  for (const model of slugs) {
    for (let i = 0; i <= retries; i++) {
      const res = await fetch(OR, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ model, messages, max_tokens: maxTokens }),
      });
      if (!res.ok) { lastErr = `${model}: HTTP ${res.status} ${(await res.text()).slice(0, 160)}`; break; }
      const json = await res.json();
      const text = json.choices?.[0]?.message?.content;
      if (text) return { text, model };
      lastErr = `${model}: empty response`;
    }
  }
  throw new Error(lastErr);
}

async function chatJson(slugs, messages, opts = {}) {
  let lastErr;
  let convo = messages;
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await chat(slugs, convo, opts);
    try {
      return { data: parseJson(r.text), model: r.model };
    } catch (e) {
      lastErr = e;
      convo = [
        ...messages,
        { role: "assistant", content: r.text.slice(0, 500) },
        { role: "user", content: "That was not valid JSON. Respond again with ONLY the JSON object — no reasoning, no prose, no code fences." },
      ];
    }
  }
  throw lastErr;
}

function parseJson(text) {
  const stripped = text.replace(/^[\s\S]*?```(?:json)?\s*/m, "").replace(/```[\s\S]*$/m, "");
  for (const candidate of [text, stripped]) {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try { return JSON.parse(candidate.slice(start, end + 1)); } catch { /* next */ }
    }
  }
  throw new Error(`unparseable JSON: ${text.slice(0, 200)}`);
}

async function genImage(slug, prompt) {
  const STYLE = "Editorial news photography, muted desaturated color grade, soft morning light, calm cinematic composition, no text, no watermarks, no logos, photorealistic, 16:9 wide format.";
  let lastErr;
  for (const model of IMAGE_MODELS) {
    const res = await fetch(OR, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ model, messages: [{ role: "user", content: `${prompt} ${STYLE}` }], modalities: ["image", "text"] }),
    });
    if (!res.ok) { lastErr = `${model}: HTTP ${res.status}`; continue; }
    const json = await res.json();
    const img = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!img?.startsWith("data:image")) { lastErr = `${model}: no image`; continue; }
    const [meta, b64] = img.split(",");
    const ext = meta.includes("png") ? "png" : "jpg";
    mkdirSync(join(root, "public", "images"), { recursive: true });
    writeFileSync(join(root, "public", "images", `${slug}.${ext}`), Buffer.from(b64, "base64"));
    return `/images/${slug}.${ext}`;
  }
  console.error(`  image failed for ${slug}: ${lastErr} — keeping placeholder`);
  return null;
}

const today = process.argv[2] ?? new Date().toISOString().slice(0, 10);
const displayDate = new Date(`${today}T12:00:00Z`).toLocaleDateString("en-US", {
  year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
});

const BAD_STORY = /no verified|unavailable|not[ -]sports|placeholder|could not|unable to|no .*(lead|headline) emerged/i;
const TRAGEDY = /school shooting|mass shooting|massacre|mass casualty|terror attack|stabbing spree/i;
const SPORTS_MUST = /(game|match|team|league|player|season|coach|tournament|championship|trade|record|final|series|cup|nfl|nba|mlb|nhl|wnba|ufc|f1|premier league|olympi|soccer|football|baseball|basketball|hockey|tennis|golf|grand slam)/i;
const TECH_MUST = /(ai|artificial intelligence|chip|semiconductor|software|app|startup|cyber|data|cloud|robot|internet|platform|model|compute|quantum|social media|smartphone|search|browser|crypto|satellite)/i;

function validateDesk(desk) {
  const problems = [];
  const sections = (desk.stories ?? []).map((s) => s.section).sort().join(",");
  if (sections !== "geopolitics,markets,sports,tech")
    problems.push(`sections must be exactly geopolitics, markets, tech, sports (got: ${sections})`);
  for (const s of desk.stories ?? []) {
    const text = `${s.slug} ${s.headline} ${s.dek}`;
    if (BAD_STORY.test(text))
      problems.push(`"${s.headline}" is a placeholder/meta story — replace it with a REAL verified ${s.section} story from the last 24-48 hours`);
    if (TRAGEDY.test(`${text} ${s.facts ?? ""}`))
      problems.push(`"${s.headline}" is a mass-casualty tragedy — editorial policy: this format never covers those. Replace with a real ${s.section} story.`);
    if (s.section === "sports" && !SPORTS_MUST.test(text))
      problems.push(`"${s.headline}" is not a sports story — the sports slot needs an actual sporting event, result, trade, or sports-business story`);
    if (s.section === "tech" && !TECH_MUST.test(text))
      problems.push(`"${s.headline}" is not a tech story — the tech slot needs a technology-industry story`);
    if ((s.facts ?? "").split(".").length < 5)
      problems.push(`"${s.headline}" has too few facts`);
  }
  return problems;
}

console.log(`── Researching ${displayDate} ──`);
const researchPrompt = {
    role: "user",
    content: `Today is ${displayDate}. You are the news desk for a daily briefing. Search current news and return the 4 most consequential REAL stories of the last 24 hours — exactly one per section: geopolitics, markets, tech, sports.

HARD RULES:
- Every story must be a real, verifiable news event. NEVER return a placeholder, apology, or meta story like "no verified lead emerged" — if your top pick is thin, pick the next-best REAL story in that section instead.
- Section fit is strict: sports = an actual sporting event, result, trade, or sports-business story; tech = a technology-industry story; markets = a financial-markets story; geopolitics = statecraft/conflict/diplomacy.
- EDITORIAL POLICY: never select mass-casualty tragedies (shootings, massacres, terror attacks) — this analytical format is not appropriate for them, in any section.
- Widen the window to 48 hours if the last 24 are quiet in a section.

Return ONLY JSON, no commentary:
{
  "ticker": [6 items: {"label": "S&P 500"|"Nasdaq"|"Dow"|other index/commodity/big-mover, "value": "string as displayed", "change": number percent}] using latest closing data,
  "stories": [4 of {
    "section": "geopolitics"|"markets"|"tech"|"sports",
    "slug": "kebab-case-short-slug",
    "headline": "specific, factual, compelling — newspaper front page style",
    "dek": "one sentence subdeck",
    "facts": "8-12 sentences of verified facts with concrete numbers, names, dates",
    "sources": ["outlet names"],
    "crux": "the ONE genuinely debatable question this story turns on, phrased as a question",
    "image_prompt": "a concrete photographic scene for an editorial illustration, no real people's faces or names"
  }]
}`,
  };

let research;
let desk;
for (let attempt = 0; attempt < 3; attempt++) {
  const messages =
    attempt === 0
      ? [researchPrompt]
      : [
          researchPrompt,
          { role: "assistant", content: JSON.stringify(desk).slice(0, 800) },
          { role: "user", content: `Rejected. Problems:\n- ${validateDesk(desk).join("\n- ")}\n\nSearch again and return the corrected full JSON with 4 REAL stories.` },
        ];
  research = await chatJson(RESEARCH_SLUGS, messages, { maxTokens: 6000 });
  desk = research.data;
  const problems = validateDesk(desk);
  if (problems.length === 0) break;
  console.log(`  research attempt ${attempt + 1} rejected: ${problems.join(" | ")}`);
  if (attempt === 2) throw new Error(`research kept failing validation: ${problems.join("; ")}`);
}
console.log(`  research via ${research.model}: ${desk.stories.length} stories, ticker ${desk.ticker?.length ?? 0}`);

const stories = [];
for (const brief of desk.stories.slice(0, 4)) {
  console.log(`── ${brief.section}: ${brief.headline}`);

  const takePrompt = (m) => [
    {
      role: "system",
      content: `You are "${m.name}" — ${m.beat} on the six-model editorial panel of narrativeNews.dev. ${m.voice} You write 2-4 tight sentences, concrete and specific, no throat-clearing.`,
    },
    {
      role: "user",
      content: `Story facts (verified by the news desk, ${displayDate}):\n${brief.facts}\n\nThe crux question: ${brief.crux}\n\nGive your take on the crux. Return ONLY JSON:\n{"stance": "your position in <8 words", "position": <number -1 to 1: -1 = strongly one side of the crux (skeptical/no/bearish), +1 = strongly the other (affirmative/yes/bullish), 0 = genuinely split>, "text": "your 2-4 sentence take"}`,
    },
  ];

  const takes = await Promise.all(
    PANEL.map(async (m) => {
      const r = await chatJson(m.slugs, takePrompt(m), { maxTokens: 1500 });
      const t = r.data;
      console.log(`  ${m.name} (${r.model}): "${t.stance}" @ ${t.position}`);
      return { modelId: m.id, stance: String(t.stance), position: Math.max(-1, Math.min(1, Number(t.position) || 0)), text: String(t.text) };
    })
  );

  const positions = takes.map((t) => t.position);
  const divergence = Math.min(1, Math.round(((Math.max(...positions) - Math.min(...positions)) / 2) * 100) / 100);
  const sorted = [...takes].sort((a, b) => Math.abs(b.position - (positions.reduce((s, p) => s + p, 0) / 6)) - Math.abs(a.position - (positions.reduce((s, p) => s + p, 0) / 6)));
  const outlier = sorted[0];

  console.log(`  writing lead + consensus (Δ ${divergence})…`);
  const writeup = await chatJson(WRITER_SLUGS, [
    {
      role: "user",
      content: `You are the lead writer for narrativeNews.dev. Using ONLY these verified facts from ${displayDate}, write the story.\n\nFACTS:\n${brief.facts}\n\nPANEL TAKES on the crux "${brief.crux}":\n${takes.map((t) => { const m = PANEL.find((p) => p.id === t.modelId); return `${m.name} (${m.beat}), stance "${t.stance}", position ${t.position}: ${t.text}`; }).join("\n")}\n\nReturn ONLY JSON:\n{"body": [4-5 paragraphs, each 3-5 sentences, newspaper register, no invented facts], "consensus": "2-3 sentences: where the panel lands, naming beats not model names where natural", "outlierNote": "1-2 sentences on why ${PANEL.find((p) => p.id === outlier.modelId).name}'s position stands apart"}`,
    },
  ], { maxTokens: 3000 });
  const written = writeup.data;

  const image = await genImage(brief.slug, brief.image_prompt);

  stories.push({
    slug: brief.slug,
    section: brief.section,
    headline: brief.headline,
    dek: brief.dek,
    image: image ?? "/images/hormuz-day-27.png",
    imageAlt: brief.image_prompt.slice(0, 120),
    date: today,
    displayDate,
    crux: brief.crux,
    body: written.body,
    sources: brief.sources,
    takes,
    consensus: written.consensus,
    outlierModelId: outlier.modelId,
    outlierNote: written.outlierNote,
    divergence,
  });
}

const issue = {
  date: today,
  displayDate,
  storySlugs: stories.map((s) => s.slug),
  summary: stories.map((s) => s.headline.split(":")[0]).join(", ") + ".",
};

// Drop unusable ticker rows (markets closed, refusals, prose values).
const ticker = (desk.ticker ?? []).filter(
  (t) => /\d/.test(String(t.value)) && String(t.value).length <= 14 && Number.isFinite(Number(t.change))
);

const out = `import type { Issue, Story, TickerItem } from "./types";

/**
 * Machine-written issues. OVERWRITTEN by scripts/generate-issue.mjs —
 * do not edit by hand. Seed content lives in data.ts.
 * Last run: ${today} via ${research.model}
 */
export const GENERATED: {
  issues: Issue[];
  stories: Story[];
  ticker: TickerItem[] | null;
} = ${JSON.stringify({ issues: [issue], stories, ticker: ticker.length ? ticker : null }, null, 2)};
`;
writeFileSync(join(root, "src", "lib", "generated.ts"), out);
console.log(`── Wrote src/lib/generated.ts: issue ${today}, ${stories.length} stories`);
