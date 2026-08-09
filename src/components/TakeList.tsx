import Link from "next/link";
import { MODEL_BY_ID } from "@/lib/models";
import type { Story } from "@/lib/types";

/**
 * The heart of a story page: six attributed takes,
 * each carrying its model's hue as a left-hand strand.
 */
export default function TakeList({ story }: { story: Story }) {
  return (
    <section aria-label="Panel takes">
      <div className="section-head" style={{ marginTop: 48 }}>
        <h2>The Panel Reads It</h2>
        <span className="mono" style={{ color: "var(--ink-3)" }}>
          6 takes · sorted by conviction
        </span>
      </div>

      {[...story.takes]
        .sort((a, b) => Math.abs(b.position) - Math.abs(a.position))
        .map((take) => {
          const model = MODEL_BY_ID[take.modelId];
          return (
            <article
              key={take.modelId}
              className="take"
              style={{ ["--take-hue" as string]: model.hue }}
            >
              <div className="take-head">
                <Link href={`/models/${model.id}`} className="take-model">
                  {model.name}
                </Link>
                <span className="take-beat">{model.beat}</span>
                <span className="take-stance">“{take.stance}”</span>
              </div>
              <p>{take.text}</p>
            </article>
          );
        })}

      <div className="consensus-block">
        <span className="eyebrow">Where they land</span>
        <p style={{ marginTop: 10, fontSize: 16, lineHeight: 1.65 }}>
          {story.consensus}
        </p>
      </div>

      <div className="outlier-block">
        <span className="eyebrow">
          The outlier — {MODEL_BY_ID[story.outlierModelId].name}
        </span>
        <p style={{ marginTop: 10, fontSize: 15.5, lineHeight: 1.65, color: "var(--ink-2)" }}>
          {story.outlierNote}
        </p>
      </div>
    </section>
  );
}
