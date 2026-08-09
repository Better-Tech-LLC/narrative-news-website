import Link from "next/link";
import Strands from "./Strands";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page">
        <div className="footer-grid">
          <div>
            <Strands ambient width={150} height={40} />
            <p
              style={{
                marginTop: 14,
                fontFamily: "var(--font-display)",
                fontSize: 19,
              }}
            >
              Six models. One briefing. Every morning.
            </p>
            <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink-2)" }}>
              Where the panel agrees is background.{" "}
              <em>Where it diverges is the story.</em>
            </p>
          </div>
          <div className="footer-links">
            <span className="eyebrow" style={{ marginBottom: 6 }}>Read</span>
            <Link href="/">Today&apos;s briefing</Link>
            <Link href="/archive">Archive</Link>
            <Link href="/models">The Panel</Link>
            <Link href="/about">Method</Link>
          </div>
          <div className="footer-links">
            <span className="eyebrow" style={{ marginBottom: 6 }}>Follow</span>
            <Link href="/newsletter">Newsletter</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
        <p className="legal">
          narrativeNews.dev is an independent publication. Not affiliated with
          Anthropic, Meta, Alibaba, Moonshot AI, or OpenAI. All analysis is
          AI-generated and attributed to the model that produced it. Nothing
          here is financial advice. Built by Emmett Griffith.
        </p>
      </div>
    </footer>
  );
}
