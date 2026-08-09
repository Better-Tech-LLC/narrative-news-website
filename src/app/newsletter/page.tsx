import Link from "next/link";
import Strands from "@/components/Strands";

export const metadata = { title: "Newsletter — narrativeNews.dev" };

const FREE = [
  "The daily briefing in your inbox — pick your sections",
  "Choose when it arrives (5–10 AM PT)",
  "Every story's panel stances and consensus",
];

const PREMIUM = [
  "AI voice reads the whole briefing to you, right from the email",
  "Lands 30 minutes before the free edition",
  "Completely ad-free, forever",
  "The full six-model panel — complete takes and outlier notes",
];

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
          divergence scores. Create an account, pick your sections, choose your
          delivery time.
        </p>
        <Strands ambient width={200} height={52} />
      </header>

      <div
        style={{
          marginTop: 44,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          maxWidth: 860,
        }}
      >
        {/* Free */}
        <section style={{ border: "1px solid var(--hairline-2)", borderRadius: 6, padding: "clamp(24px, 3vw, 32px)", display: "flex", flexDirection: "column" }}>
          <span className="eyebrow">Free</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 26, margin: "10px 0 16px" }}>
            The morning briefing.
          </h2>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10, marginBottom: 24 }}>
            {FREE.map((perk) => (
              <li key={perk} style={{ fontSize: 15, color: "var(--ink-2)", paddingLeft: 20, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, top: 9, width: 8, height: 8, borderRadius: "50%", background: "var(--ink-3)" }} aria-hidden="true" />
                {perk}
              </li>
            ))}
          </ul>
          <Link href="/account" className="btn" style={{ marginTop: "auto", textAlign: "center" }}>
            Create your account
          </Link>
        </section>

        {/* Premium */}
        <section style={{ background: "var(--paper-2)", borderRadius: 6, padding: "clamp(24px, 3vw, 32px)", display: "flex", flexDirection: "column" }}>
          <span className="eyebrow">Premium — $7.99/month</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 26, margin: "10px 0 16px" }}>
            Earlier. <em>And out loud.</em>
          </h2>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10, marginBottom: 24 }}>
            {PREMIUM.map((perk) => (
              <li key={perk} style={{ fontSize: 15, color: "var(--ink-2)", paddingLeft: 20, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, top: 9, width: 8, height: 8, borderRadius: "50%", background: "var(--live)" }} aria-hidden="true" />
                {perk}
              </li>
            ))}
          </ul>
          <Link href="/account" className="btn" style={{ marginTop: "auto", textAlign: "center" }}>
            Start 3-day free trial
          </Link>
          <p className="mono" style={{ marginTop: 12, color: "var(--ink-3)", textAlign: "center" }}>
            No card required. Cancel anytime.
          </p>
        </section>
      </div>

      <p className="mono" style={{ marginTop: 32, color: "var(--ink-3)", maxWidth: 560 }}>
        Your email is used for the briefing and nothing else. Unsubscribe
        anytime from your account page.
      </p>
    </div>
  );
}
