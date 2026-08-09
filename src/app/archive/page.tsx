import Link from "next/link";
import { ISSUES, getStory } from "@/lib/data";
import Strands from "@/components/Strands";

export const metadata = { title: "Archive — narrativeNews.dev" };

export default function ArchivePage() {
  return (
    <div className="page">
      <header className="article-header rise">
        <span className="eyebrow">Archive</span>
        <h1 style={{ marginTop: 10 }}>
          Every briefing, <em>kept.</em>
        </h1>
        <p className="dek" style={{ fontSize: 17, marginTop: 14, maxWidth: 600 }}>
          Narratives age. The archive is how you check who read the moment
          right — every issue, every take, exactly as published.
        </p>
      </header>

      <div style={{ marginTop: 40 }}>
        {ISSUES.map((issue) => (
          <div
            key={issue.date}
            style={{
              borderTop: "1px solid var(--hairline)",
              padding: "28px 0",
              display: "grid",
              gridTemplateColumns: "minmax(140px, 1fr) 3fr",
              gap: 24,
            }}
          >
            <div>
              <span className="mono" style={{ color: "var(--ink-3)" }}>
                {issue.date}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: 22,
                  marginTop: 6,
                }}
              >
                {issue.displayDate}
              </h2>
            </div>
            <div>
              <p style={{ color: "var(--ink-2)", fontSize: 15.5 }}>
                {issue.summary}
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginTop: 14 }}>
                {issue.storySlugs.map((slug) => {
                  const story = getStory(slug);
                  if (!story) return null;
                  return (
                    <li key={slug} style={{ padding: "6px 0" }}>
                      <Link
                        href={`/story/${slug}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          fontSize: 15,
                        }}
                      >
                        <Strands takes={story.takes} width={64} height={22} />
                        <span className="headline" style={{ fontSize: 16 }}>
                          {story.headline}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}

        <div
          style={{
            borderTop: "1px solid var(--hairline)",
            padding: "28px 0",
            color: "var(--ink-3)",
          }}
        >
          <p className="mono">
            Earlier issues will appear here as the daily pipeline runs.
          </p>
        </div>
      </div>
    </div>
  );
}
