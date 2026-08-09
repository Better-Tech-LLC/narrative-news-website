import NewsletterForm from "@/components/NewsletterForm";
import Strands from "@/components/Strands";

export const metadata = { title: "Newsletter — narrativeAI.dev" };

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
    </div>
  );
}
