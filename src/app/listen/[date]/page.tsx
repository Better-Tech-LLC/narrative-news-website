import Link from "next/link";
import { notFound } from "next/navigation";
import { AUDIO } from "@/lib/audio-manifest";
import { getStory } from "@/lib/data";
import Strands from "@/components/Strands";

export function generateStaticParams() {
  return Object.keys(AUDIO).map((date) => ({ date }));
}

export default async function ListenPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const issue = AUDIO[date];
  if (!issue) notFound();

  return (
    <div className="page">
      <header className="article-header rise">
        <span className="eyebrow">The spoken briefing · Premium</span>
        <h1 style={{ marginTop: 10 }}>
          Listen to <em>{issue.displayDate}.</em>
        </h1>
        <p className="dek" style={{ fontSize: 17, marginTop: 14, maxWidth: 560 }}>
          The full briefing, read aloud — one segment per story, so you can
          skip straight to the split that interests you.
        </p>
        <Strands ambient width={200} height={52} />
      </header>

      <div style={{ marginTop: 40, maxWidth: "var(--measure)" }}>
        {issue.segments.map((seg) => {
          const story = getStory(seg.slug);
          return (
            <section
              key={seg.slug}
              style={{ borderTop: "1px solid var(--hairline)", padding: "24px 0" }}
            >
              <span className="eyebrow">{seg.section}</span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: 22,
                  margin: "8px 0 14px",
                }}
              >
                {story ? (
                  <Link href={`/story/${seg.slug}`}>{seg.headline}</Link>
                ) : (
                  seg.headline
                )}
              </h2>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption -- transcript is the linked story */}
              <audio
                controls
                preload="none"
                src={seg.src}
                style={{ width: "100%" }}
              />
            </section>
          );
        })}
      </div>

      <p className="mono" style={{ marginTop: 32, color: "var(--ink-3)" }}>
        AI-narrated from the day&apos;s attributed analysis. Read the full
        takes on each story page.
      </p>
    </div>
  );
}
