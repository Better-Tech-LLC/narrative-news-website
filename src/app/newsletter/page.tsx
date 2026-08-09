import NewsletterForm from "@/components/NewsletterForm";
import Strands from "@/components/Strands";

export const metadata = { title: "Newsletter — narrativeNews.dev" };

export default function NewsletterPage() {
  return (
    <div className="page">
      <header className="article-header rise">
        <span className="eyebrow">Newsletter</span>
        <h1 style={{ marginTop: 10 }}>
          The panel, <em>in your inbox.</em>
        </h1>
        <p className="dek" style={{ fontSize: 17, marginTop: 16, maxWidth: 560 }}>
          One email every morning: the day&apos;s stories, the six takes, the
          divergence scores. Pick the sections you care about — skip the rest.
        </p>
        <Strands ambient width={200} height={52} />
      </header>

      <div style={{ marginTop: 40, marginBottom: 24 }}>
        <NewsletterForm />
      </div>

      <p className="mono" style={{ color: "var(--ink-3)", maxWidth: 520 }}>
        Free. Unsubscribe anytime. Your email is used for the briefing and
        nothing else.
      </p>

      <section
        style={{
          marginTop: 48,
          padding: "clamp(24px, 4vw, 40px)",
          background: "var(--paper-2)",
          borderRadius: 6,
          maxWidth: 640,
        }}
        aria-label="Premium"
      >
        <span className="eyebrow">Premium — $8/month · launching soon</span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: 26,
            margin: "10px 0 14px",
          }}
        >
          Earlier. <em>And out loud.</em>
        </h2>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {[
            "The briefing lands 30 minutes before the free edition",
            "The spoken briefing — every story read aloud, right inside the email",
            "The full six-take panel on every story, plus the outlier note",
          ].map((perk) => (
            <li
              key={perk}
              style={{
                fontSize: 15,
                color: "var(--ink-2)",
                paddingLeft: 20,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 9,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--live)",
                }}
                aria-hidden="true"
              />
              {perk}
            </li>
          ))}
        </ul>
        <p className="mono" style={{ marginTop: 16, color: "var(--ink-3)" }}>
          Sign up free above — premium opens to the list first.
        </p>
      </section>
    </div>
  );
}
