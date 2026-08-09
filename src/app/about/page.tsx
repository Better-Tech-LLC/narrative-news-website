import Link from "next/link";
import { PANEL } from "@/lib/models";
import Strands from "@/components/Strands";

export const metadata = { title: "Method — narrativeAI.dev" };

const STEPS = [
  {
    title: "Same stories, same sources",
    text: "Each morning, the day's four most consequential stories are selected with their source material — wire reports, filings, primary documents. Every model on the panel receives the identical brief.",
  },
  {
    title: "Six independent reads",
    text: "Each model writes its take in its assigned beat, without seeing the others' answers. Independence is the point: agreement means something only when it wasn't coordinated.",
  },
  {
    title: "The crux and the split",
    text: "Every story is reduced to one crux question. Each take is scored for its position on that question, and the spread becomes the story's divergence score — the number on every card.",
  },
  {
    title: "Attribution, always",
    text: "Every sentence of analysis on this site is attributed to the model that produced it. No blended voice, no anonymous 'AI says'. When a model is wrong, the archive remembers.",
  },
];

export default function AboutPage() {
  return (
    <div className="page">
      <header className="article-header rise">
        <span className="eyebrow">Method</span>
        <h1 style={{ marginTop: 10 }}>
          Disagreement is the product.
        </h1>
        <p className="dek" style={{ fontSize: 17, marginTop: 16, maxWidth: 620 }}>
          A single AI summarizing the news gives you one machine&apos;s blind
          spots with confident delivery. A panel of six, forced to answer the
          same question independently, shows you where the uncertainty
          actually lives.
        </p>
        <Strands ambient width={220} height={56} />
      </header>

      <div style={{ marginTop: 48, maxWidth: "var(--measure)" }}>
        {STEPS.map((step, i) => (
          <section
            key={step.title}
            style={{ borderTop: "1px solid var(--hairline)", padding: "26px 0" }}
          >
            <span className="mono" style={{ color: "var(--ink-3)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: 24,
                margin: "6px 0 10px",
              }}
            >
              {step.title}
            </h2>
            <p style={{ color: "var(--ink-2)", fontSize: 16, lineHeight: 1.7 }}>
              {step.text}
            </p>
          </section>
        ))}
      </div>

      <div className="section-head">
        <h2>The panel</h2>
        <Link href="/models" className="mono" style={{ color: "var(--ink-2)" }}>
          Full profiles →
        </Link>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 18 }}>
        {PANEL.map((m) => (
          <span key={m.id} className="model-chip">
            <i style={{ background: m.hue }} aria-hidden="true" />
            {m.name} — {m.beat}
          </span>
        ))}
      </div>
    </div>
  );
}
