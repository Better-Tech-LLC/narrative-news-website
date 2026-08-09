import Link from "next/link";
import { CURRENT_ISSUE, SECTIONS, getCurrentStories, getStoriesBySection } from "@/lib/data";
import { PANEL } from "@/lib/models";
import Strands from "@/components/Strands";
import StoryCard from "@/components/StoryCard";
import ModelChip from "@/components/ModelChip";

export default function FrontPage() {
  const [lead, ...rest] = [...getCurrentStories()].sort(
    (a, b) => b.divergence - a.divergence
  );

  return (
    <div className="page">
      {/* ── Hero: the thesis ── */}
      <section className="hero rise">
        <span className="eyebrow">The morning briefing · {CURRENT_ISSUE.displayDate}</span>
        <h1 style={{ marginTop: 14 }}>
          Six machines read the news. <em>They don&apos;t agree.</em>
        </h1>
        <p className="hero-sub">
          Every morning, a panel of six AI models analyzes the same stories.
          Where they agree is background. Where they diverge is the story.
        </p>
        <div className="hero-strands" aria-hidden="true">
          <Strands ambient width={340} height={200} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 28 }}>
          {PANEL.map((m) => (
            <ModelChip key={m.id} model={m} />
          ))}
        </div>
      </section>

      {/* ── Lead: today's most divided story ── */}
      <section aria-label="Lead story">
        <div className="section-head">
          <h2>Most Divided Today</h2>
          <span className="mono" style={{ color: "var(--ink-3)" }}>
            ranked by panel divergence
          </span>
        </div>
        <div className="lead-story" style={{ paddingTop: 24 }}>
          <StoryCard story={lead} size="lead" showImage />
          <div>
            <div
              style={{
                borderLeft: "2px solid var(--ink)",
                paddingLeft: 18,
                marginBottom: 20,
              }}
            >
              <span className="crux-label">The crux</span>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 19,
                  lineHeight: 1.4,
                  marginTop: 6,
                }}
              >
                {lead.crux}
              </p>
            </div>
            {rest.slice(0, 3).map((s) => (
              <StoryCard key={s.slug} story={s} size="small" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Sections ── */}
      {SECTIONS.map((section) => {
        const stories = getStoriesBySection(section.slug);
        if (stories.length === 0) return null;
        return (
          <section key={section.slug} aria-label={section.name}>
            <div className="section-head">
              <h2>
                <Link href={`/section/${section.slug}`}>{section.name}</Link>
              </h2>
              <span className="mono" style={{ color: "var(--ink-3)" }}>
                {section.blurb}
              </span>
            </div>
            <div className="story-grid">
              {stories.map((s) => (
                <StoryCard key={s.slug} story={s} size="medium" />
              ))}
            </div>
          </section>
        );
      })}

      {/* ── Newsletter strip ── */}
      <section
        style={{
          marginTop: "clamp(48px, 7vw, 88px)",
          padding: "clamp(32px, 5vw, 56px)",
          background: "var(--paper-2)",
          borderRadius: 6,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(24px, 3vw, 32px)",
              lineHeight: 1.15,
            }}
          >
            The panel, in your inbox.
          </h2>
          <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 15.5 }}>
            Pick your sections. Get the briefing — takes, divergence and all —
            every morning.
          </p>
        </div>
        <Link href="/newsletter" className="btn">
          Sign up free
        </Link>
      </section>
    </div>
  );
}
