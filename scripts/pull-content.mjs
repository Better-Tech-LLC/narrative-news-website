// Pull published issues from Supabase into src/lib/generated.ts and
// src/lib/audio-manifest.ts. Runs as `prebuild` (locally and on Vercel), so
// the site is rebuilt purely from backend content. Fails soft: if Supabase
// is unreachable or empty, the existing files are kept.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
if (existsSync(join(root, ".env.local"))) {
  for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function rest(path) {
  const res = await fetch(`${SB}/rest/v1/${path}`, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
  });
  if (!res.ok) throw new Error(`rest ${path}: HTTP ${res.status}`);
  return res.json();
}

function displayDateOf(date) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

try {
  if (!SB || !ANON) throw new Error("supabase env not set");
  const issues = await rest(
    "nn_issues?published_at=not.is.null&select=id,issue_date,summary,ticker,audio&order=issue_date.desc&limit=60"
  );
  if (issues.length === 0) throw new Error("no published issues");

  const outIssues = [];
  const outStories = [];
  const audioManifests = {};

  for (const issue of issues) {
    const date = issue.issue_date;
    const displayDate = displayDateOf(date);
    const stories = await rest(
      `nn_stories?issue_id=eq.${issue.id}&select=id,slug,section,headline,dek,image_url,image_alt,crux,body,sources,consensus,outlier_model_id,outlier_note,divergence&order=created_at`
    );
    const takes = await rest(
      `nn_takes?story_id=in.(${stories.map((s) => s.id).join(",")})&select=story_id,model_id,stance,body,position`
    );
    const takesByStory = {};
    for (const t of takes) (takesByStory[t.story_id] ??= []).push(t);

    outIssues.push({
      date,
      displayDate,
      storySlugs: stories.map((s) => s.slug),
      summary: issue.summary ?? "",
    });
    for (const s of stories) {
      outStories.push({
        slug: s.slug,
        section: s.section,
        headline: s.headline,
        dek: s.dek ?? "",
        image: s.image_url ?? "/images/hormuz-day-27.png",
        imageAlt: s.image_alt ?? "",
        date,
        displayDate,
        crux: s.crux ?? "",
        body: s.body ?? [],
        sources: s.sources ?? [],
        takes: (takesByStory[s.id] ?? []).map((t) => ({
          modelId: t.model_id,
          stance: t.stance,
          position: Number(t.position),
          text: t.body,
        })),
        consensus: s.consensus ?? "",
        outlierModelId: s.outlier_model_id ?? "kimi",
        outlierNote: s.outlier_note ?? "",
        divergence: Number(s.divergence),
      });
    }
    if (issue.audio) audioManifests[date] = issue.audio;
  }

  const newestTicker = issues[0].ticker ?? null;

  writeFileSync(
    join(root, "src", "lib", "generated.ts"),
    `import type { Issue, Story, TickerItem } from "./types";

/**
 * Machine-written issues. OVERWRITTEN by scripts/pull-content.mjs (prebuild)
 * from the Supabase backend — do not edit by hand.
 */
export const GENERATED: {
  issues: Issue[];
  stories: Story[];
  ticker: TickerItem[] | null;
} = ${JSON.stringify({ issues: outIssues, stories: outStories, ticker: newestTicker }, null, 2)};
`
  );
  writeFileSync(
    join(root, "src", "lib", "audio-manifest.ts"),
    `/**
 * Spoken-briefing manifest. OVERWRITTEN by scripts/pull-content.mjs (prebuild).
 */
export interface AudioSegment {
  slug: string;
  headline: string;
  section: string;
  src: string;
}
export interface AudioIssue {
  date: string;
  displayDate: string;
  segments: AudioSegment[];
}
export const AUDIO: Record<string, AudioIssue> = ${JSON.stringify(audioManifests, null, 2)};
`
  );
  console.log(
    `pulled ${outIssues.length} issue(s), ${outStories.length} stories, ${Object.keys(audioManifests).length} audio manifest(s) from Supabase`
  );
} catch (e) {
  console.warn(`pull-content: ${e.message} — keeping existing generated content`);
}
