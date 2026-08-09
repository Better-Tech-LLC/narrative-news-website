import Link from "next/link";
import { notFound } from "next/navigation";
import { PANEL, MODEL_BY_ID } from "@/lib/models";
import { STORIES } from "@/lib/data";

export function generateStaticParams() {
  return PANEL.map((m) => ({ slug: m.id }));
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = MODEL_BY_ID[slug];
  if (!model) notFound();

  const takes = STORIES.flatMap((story) => {
    const take = story.takes.find((t) => t.modelId === slug);
    return take ? [{ story, take }] : [];
  });

  return (
    <div className="page">
      <header className="article-header rise">
        <span
          style={{
            width: 44,
            height: 5,
            borderRadius: 2,
            background: model.hue,
            display: "block",
            marginBottom: 18,
          }}
          aria-hidden="true"
        />
        <span className="eyebrow">{model.beat} · {model.maker}</span>
        <h1 style={{ marginTop: 10 }}>{model.name}</h1>
        <p className="dek" style={{ fontSize: 17, marginTop: 14, maxWidth: 600 }}>
          {model.beatDescription}
        </p>
      </header>

      <div className="section-head">
        <h2>How this beat reads the world</h2>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {model.tendencies.map((t) => (
          <li
            key={t}
            style={{
              padding: "14px 0 14px 22px",
              borderTop: "1px solid var(--hairline)",
              position: "relative",
              fontSize: 15.5,
              color: "var(--ink-2)",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: model.hue,
              }}
              aria-hidden="true"
            />
            {t}
          </li>
        ))}
      </ul>
      <p className="mono" style={{ marginTop: 16, color: "var(--ink-3)" }}>
        {model.sampleQuestionStance}
      </p>

      <div className="section-head">
        <h2>Latest takes</h2>
        <span className="mono" style={{ color: "var(--ink-3)" }}>
          {takes.length} this issue
        </span>
      </div>
      {takes.map(({ story, take }) => (
        <Link
          key={story.slug}
          href={`/story/${story.slug}`}
          className="take"
          style={{ ["--take-hue" as string]: model.hue, display: "block" }}
        >
          <div className="take-head">
            <span className="take-model">{story.headline}</span>
            <span className="take-stance">“{take.stance}”</span>
          </div>
          <p>{take.text}</p>
        </Link>
      ))}
    </div>
  );
}
