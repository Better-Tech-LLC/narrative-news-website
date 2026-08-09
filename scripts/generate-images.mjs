// Generate article hero images with Nano Banana (Gemini image model) via OpenRouter.
// Usage: node scripts/generate-images.mjs [slug ...]   (no args = all)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Minimal .env.local parser — no deps.
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const KEY = process.env.OPENROUTER_API_KEY;
if (!KEY) throw new Error("OPENROUTER_API_KEY missing");

const STYLE =
  "Editorial news photography, muted desaturated color grade, soft morning light, calm cinematic composition, shallow depth of field, no text, no watermarks, no logos, photorealistic, 16:9 wide format.";

const PROMPTS = {
  "hormuz-day-27":
    "Aerial view of a massive container ship passing through a narrow strait at dawn, hazy golden light over dark water, distant tankers waiting at anchor on the horizon.",
  "wall-street-triple-threat":
    "A quiet trading floor moments after close, wall of screens showing red declining charts reflected on an empty desk, one trader silhouetted looking up at the boards.",
  "big-tech-immunity-ends":
    "A vast empty courtroom with dark wood paneling intercut by the cold blue glow of a server-room corridor visible through tall doors, symbolic tension between law and technology.",
  "mlb-opening-day-2026":
    "A baseball pitcher mid-windup on the mound at a packed stadium on opening day, late-afternoon light raking across the infield grass, bunting on the railings.",
};

const MODELS = [
  "google/gemini-3.1-flash-image",
  "google/gemini-3-pro-image",
];

async function generate(slug, prompt) {
  let lastErr;
  for (const model of MODELS) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: `${prompt} ${STYLE}` }],
        modalities: ["image", "text"],
      }),
    });
    if (!res.ok) {
      lastErr = `${model}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`;
      continue;
    }
    const json = await res.json();
    const img = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!img?.startsWith("data:image")) {
      lastErr = `${model}: no image in response`;
      continue;
    }
    const [meta, b64] = img.split(",");
    const ext = meta.includes("png") ? "png" : "jpg";
    const out = join(root, "public", "images", `${slug}.${ext}`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, Buffer.from(b64, "base64"));
    return `${slug}.${ext} (${Math.round(Buffer.from(b64, "base64").length / 1024)}kb via ${model})`;
  }
  throw new Error(`${slug} failed: ${lastErr}`);
}

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : Object.keys(PROMPTS);

for (const slug of targets) {
  if (!PROMPTS[slug]) {
    console.error(`no prompt for ${slug}`);
    continue;
  }
  console.log(`generating ${slug}…`);
  console.log("  ✓", await generate(slug, PROMPTS[slug]));
}
