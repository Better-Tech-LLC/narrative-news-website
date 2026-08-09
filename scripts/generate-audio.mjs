// Generate the spoken briefing for premium subscribers.
// One audio file per story (plus the intro on the first), written to
// public/audio/<date>/, with a manifest at src/lib/audio-manifest.ts.
//
// Provider: Gemini TTS when GEMINI_API_KEY is set, otherwise
// openai/gpt-audio-mini via OpenRouter (uses the existing key).
// Usage: node scripts/generate-audio.mjs [date]
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

// Load the generated issue (parse the JSON literal out of generated.ts).
const genSrc = readFileSync(join(root, "src", "lib", "generated.ts"), "utf8");
const jsonStart = genSrc.indexOf("= {");
const GENERATED = JSON.parse(genSrc.slice(jsonStart + 2).replace(/;\s*$/, ""));
const issue = GENERATED.issues[0];
if (!issue) throw new Error("no generated issue — run generate-issue.mjs first");
const date = process.argv[2] ?? issue.date;
if (date !== issue.date) throw new Error(`generated issue is ${issue.date}, not ${date}`);

const stories = issue.storySlugs
  .map((slug) => GENERATED.stories.find((s) => s.slug === slug))
  .filter(Boolean);

const INTRO = `narrative News. ${issue.displayDate}. Six models read the news — here's where they split.`;

function narration(story, isFirst) {
  const divergenceLine =
    story.divergence >= 0.45
      ? `The panel splits on this one — divergence ${story.divergence.toFixed(2)}.`
      : `The panel is close to consensus here — divergence ${story.divergence.toFixed(2)}.`;
  return [
    isFirst ? INTRO : "",
    `${story.section}. ${story.headline}.`,
    story.dek,
    ...story.body.slice(0, 2),
    `The crux: ${story.crux}`,
    divergenceLine,
    story.consensus,
    `The outlier: ${story.outlierNote}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function ttsGemini(text) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent",
    {
      method: "POST",
      headers: {
        "x-goog-api-key": process.env.GEMINI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Read this news briefing in a calm, measured newsreader voice:\n\n${text}` }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } } },
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`gemini tts: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const b64 = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!b64) throw new Error("gemini tts: no audio in response");
  return { buf: wavFromPcm(Buffer.from(b64, "base64")), ext: "wav" };
}

// Wrap raw 24kHz 16-bit mono PCM in a WAV header.
function wavFromPcm(pcm, rate = 24000) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0); header.writeUInt32LE(36 + pcm.length, 4); header.write("WAVE", 8);
  header.write("fmt ", 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22); header.writeUInt32LE(rate, 24); header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
  header.write("data", 36); header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function ttsOpenRouter(text) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://narrativenews.dev",
      "X-Title": "narrativeNews.dev",
    },
    body: JSON.stringify({
      model: "openai/gpt-audio-mini",
      modalities: ["text", "audio"],
      audio: { voice: "ash", format: "pcm16" },
      stream: true,
      max_tokens: 30000,
      messages: [
        {
          role: "system",
          content: "You are the narrator of a news briefing. Read the user's text verbatim in a calm, measured newsreader delivery. Do not add, skip, or change any words.",
        },
        { role: "user", content: text },
      ],
    }),
  });
  if (!res.ok) throw new Error(`openrouter tts: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  // SSE stream: accumulate base64 audio deltas.
  const chunks = [];
  let buffer = "";
  const decoder = new TextDecoder();
  for await (const part of res.body) {
    buffer += decoder.decode(part, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
      try {
        const delta = JSON.parse(line.slice(6)).choices?.[0]?.delta;
        const b64 = delta?.audio?.data;
        if (b64) chunks.push(Buffer.from(b64, "base64"));
      } catch { /* keepalive/comment lines */ }
    }
  }
  if (chunks.length === 0) throw new Error("openrouter tts: no audio deltas in stream");
  return { buf: wavFromPcm(Buffer.concat(chunks)), ext: "wav" };
}

const provider = process.env.GEMINI_API_KEY ? ttsGemini : ttsOpenRouter;
console.log(`── Narrating ${issue.displayDate} via ${process.env.GEMINI_API_KEY ? "Gemini TTS" : "OpenRouter gpt-audio-mini"}`);

const outDir = join(root, "public", "audio", date);
mkdirSync(outDir, { recursive: true });

const manifest = { date, displayDate: issue.displayDate, segments: [] };
for (let i = 0; i < stories.length; i++) {
  const story = stories[i];
  const text = narration(story, i === 0);
  console.log(`  ${story.slug} (${text.split(/\s+/).length} words)…`);
  const { buf, ext } = await provider(text);
  let file = `${story.slug}.${ext}`;
  writeFileSync(join(outDir, file), buf);
  if (ext === "wav") {
    // Compress with macOS-native afconvert (AAC ~64kbps is plenty for speech).
    try {
      const m4a = `${story.slug}.m4a`;
      execSync(`afconvert -f m4af -d aac "${join(outDir, file)}" "${join(outDir, m4a)}"`, { stdio: "pipe" });
      unlinkSync(join(outDir, file));
      file = m4a;
    } catch { /* keep wav if afconvert unavailable */ }
  }
  manifest.segments.push({
    slug: story.slug,
    headline: story.headline,
    section: story.section,
    src: `/audio/${date}/${file}`,
  });
  console.log(`  ✓ ${file} (${Math.round(buf.length / 1024)}kb)`);
}

const manifestPath = join(root, "src", "lib", "audio-manifest.ts");
const existing = existsSync(manifestPath)
  ? readFileSync(manifestPath, "utf8")
  : "";
let all = {};
const em = existing.indexOf("= {");
if (em >= 0) {
  try { all = JSON.parse(existing.slice(em + 2).replace(/;\s*$/, "")); } catch { all = {}; }
}
all[date] = manifest;
writeFileSync(
  manifestPath,
  `/**
 * Spoken-briefing manifest. OVERWRITTEN by scripts/generate-audio.mjs.
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
export const AUDIO: Record<string, AudioIssue> = ${JSON.stringify(all, null, 2)};
`
);
console.log(`── Wrote manifest: ${manifest.segments.length} segments for ${date}`);
