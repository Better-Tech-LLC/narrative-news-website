import { notFound } from "next/navigation";
import { SECTIONS, getSection, getStoriesBySection } from "@/lib/data";
import StoryCard from "@/components/StoryCard";

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ slug: s.slug }));
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  const stories = getStoriesBySection(slug);

  return (
    <div className="page">
      <header className="article-header rise">
        <span className="eyebrow">Section</span>
        <h1 style={{ marginTop: 10 }}>{section.name}</h1>
        <p className="dek" style={{ fontSize: 17, marginTop: 14 }}>
          {section.blurb}
        </p>
      </header>

      <div style={{ marginTop: 40 }}>
        {stories.length > 0 ? (
          stories.map((s) => <StoryCard key={s.slug} story={s} size="lead" showImage />)
        ) : (
          <div style={{ padding: "48px 0", borderTop: "1px solid var(--hairline)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>
              No stories in this section yet today.
            </p>
            <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 15 }}>
              The panel publishes every morning. Check back after the next briefing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
