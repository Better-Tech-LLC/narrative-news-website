// Send the daily briefing email with the premium stagger:
//   premium subscribers  → sent immediately (T+0), with the spoken briefing
//   free subscribers     → sent 30 minutes later (T+30), text only
//
// Requires RESEND_API_KEY in .env.local (resend.com). Without it the script
// runs in DRY RUN mode: renders the emails and prints who would get what.
// Usage: node scripts/send-newsletter.mjs [date] [--free-batch]
//   (default sends the premium batch; --free-batch sends the free batch —
//    schedule the second invocation 30 minutes after the first)
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const SITE = "https://narrativenews.dev";
const FROM = "narrativeNews <briefing@narrativenews.dev>";

const genSrc = readFileSync(join(root, "src", "lib", "generated.ts"), "utf8");
const GENERATED = JSON.parse(genSrc.slice(genSrc.indexOf("= {") + 2).replace(/;\s*$/, ""));
const issue = GENERATED.issues[0];
if (!issue) throw new Error("no generated issue");

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const freeBatch = process.argv.includes("--free-batch");
const date = args[0] ?? issue.date;
if (date !== issue.date) throw new Error(`generated issue is ${issue.date}, not ${date}`);

let audio = null;
try {
  const audioSrc = readFileSync(join(root, "src", "lib", "audio-manifest.ts"), "utf8");
  const AUDIO = JSON.parse(audioSrc.slice(audioSrc.indexOf("= {") + 2).replace(/;\s*$/, ""));
  audio = AUDIO[date] ?? null;
} catch { /* no audio yet */ }

const stories = issue.storySlugs
  .map((slug) => GENERATED.stories.find((s) => s.slug === slug))
  .filter(Boolean);

const HUES = { claude: "#C15F3C", "llama-scout": "#3E6FD9", "llama-70b": "#5A8A3C", qwen: "#7D58C6", kimi: "#23968B", "gpt-oss": "#C99A2E" };
const NAMES = { claude: "Claude", "llama-scout": "Llama 4 Scout", "llama-70b": "Llama 3.3 70B", qwen: "Qwen 3", kimi: "Kimi K2", "gpt-oss": "GPT-OSS 120B" };

function renderEmail({ premium, topics }) {
  const picked = stories.filter((s) => topics.includes(s.section));
  const list = picked.length ? picked : stories;
  const listenBlock = premium && audio
    ? `<div style="background:#f2f2ee;border-radius:6px;padding:20px 24px;margin:0 0 28px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#4c505c;font-weight:600;">Premium · The spoken briefing</p>
        <p style="margin:0 0 12px;font-size:15px;color:#16181d;">Prefer to listen? Today's briefing, read aloud — one segment per story.</p>
        <a href="${SITE}/listen/${date}" style="display:inline-block;background:#16181d;color:#fafaf7;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:11px 20px;border-radius:4px;">▶ Listen (${audio.segments.length} segments)</a>
      </div>`
    : "";
  const storyBlocks = list
    .map((s) => {
      const takes = s.takes
        .map((t) => `<tr>
            <td style="width:3px;background:${HUES[t.modelId] ?? "#888"};border-radius:2px;"></td>
            <td style="padding:8px 0 8px 14px;">
              <span style="font-size:13px;font-weight:700;color:#16181d;">${NAMES[t.modelId] ?? t.modelId}</span>
              <span style="font-size:12px;color:#8b8f9a;font-family:monospace;"> — “${t.stance}”</span>
            </td>
          </tr>`)
        .join("");
      return `<div style="border-top:1px solid #e3e3dc;padding:24px 0;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#4c505c;font-weight:600;">${s.section} · Δ ${s.divergence.toFixed(2)}</p>
        <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;line-height:1.2;"><a href="${SITE}/story/${s.slug}" style="color:#16181d;text-decoration:none;">${s.headline}</a></h2>
        <p style="margin:0 0 14px;font-size:15px;color:#4c505c;line-height:1.55;">${s.dek}</p>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 14px;">${takes}</table>
        <p style="margin:0;font-size:14px;color:#4c505c;line-height:1.6;"><b style="color:#16181d;">Where they land:</b> ${s.consensus}</p>
        <p style="margin:12px 0 0;"><a href="${SITE}/story/${s.slug}" style="font-size:13px;color:#16181d;font-weight:600;">Read the full takes →</a></p>
      </div>`;
    })
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#fafaf7;color:#16181d;font-family:Georgia,serif;">
    <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
      <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:20px;font-weight:600;">narrative<i>News</i><span style="font-family:monospace;font-size:11px;color:#8b8f9a;">.dev</span></p>
      <p style="margin:0 0 28px;font-size:12px;color:#8b8f9a;font-family:monospace;">${issue.displayDate}${premium ? " · Premium early edition" : ""}</p>
      ${listenBlock}
      ${storyBlocks}
      <p style="margin:28px 0 0;font-size:11px;color:#8b8f9a;line-height:1.6;">Six models. One briefing. Every morning. AI-generated analysis, every take attributed — not financial advice.<br/><a href="${SITE}/newsletter" style="color:#8b8f9a;">Manage subscription</a></p>
    </div>
  </body></html>`;
}

async function getSubscribers(premium) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  // Service role required to read subscribers; anon key returns [] under RLS.
  const res = await fetch(
    `${url}/rest/v1/nn_subscribers?select=email,topics,is_premium&unsubscribed_at=is.null&is_premium=eq.${premium}`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`supabase: HTTP ${res.status}`);
  return res.json();
}

const premium = !freeBatch;
const subs = await getSubscribers(premium);
console.log(`── ${premium ? "PREMIUM (T+0)" : "FREE (T+30)"} batch for ${issue.displayDate}: ${subs.length} recipients`);

const resendKey = process.env.RESEND_API_KEY;
if (!resendKey) {
  console.log("DRY RUN (no RESEND_API_KEY) — sample email rendered below:");
  console.log(renderEmail({ premium, topics: ["geopolitics", "markets", "tech", "sports"] }).slice(0, 400) + "…");
  process.exit(0);
}

for (const sub of subs) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: sub.email,
      subject: `${issue.displayDate} — ${stories[0]?.headline ?? "The morning briefing"}`,
      html: renderEmail({ premium, topics: sub.topics ?? [] }),
    }),
  });
  console.log(`  ${res.ok ? "✓" : "✗"} ${sub.email}${res.ok ? "" : ` (HTTP ${res.status})`}`);
}
