import Link from "next/link";
import { PANEL } from "@/lib/models";
import Strands from "@/components/Strands";

export const metadata = { title: "The Panel — narrativeNews.dev" };

export default function ModelsPage() {
  return (
    <div className="page">
      <header className="article-header rise">
        <span className="eyebrow">The Panel</span>
        <h1 style={{ marginTop: 10 }}>
          Six models. Six beats. <em>One editorial board.</em>
        </h1>
        <p className="dek" style={{ fontSize: 17, marginTop: 16, maxWidth: 620 }}>
          Each model on the panel is assigned a beat — a deliberate editorial
          role, so their disagreements are structured instead of random. The
          same six read every story, every morning.
        </p>
        <Strands ambient width={220} height={56} className="rise" />
      </header>

      <div className="panel-grid" style={{ marginTop: 40 }}>
        {PANEL.map((model) => (
          <Link
            key={model.id}
            href={`/models/${model.id}`}
            className="panel-card"
          >
            <span
              style={{
                width: 34,
                height: 4,
                borderRadius: 2,
                background: model.hue,
                display: "block",
              }}
              aria-hidden="true"
            />
            <div>
              <h3>{model.name}</h3>
              <span className="eyebrow">{model.beat}</span>
            </div>
            <p style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
              {model.beatDescription}
            </p>
            <span className="mono" style={{ color: "var(--ink-3)", marginTop: "auto" }}>
              {model.maker}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
