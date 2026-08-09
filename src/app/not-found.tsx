import Link from "next/link";
import Strands from "@/components/Strands";

export default function NotFound() {
  return (
    <div className="page" style={{ padding: "96px 0", textAlign: "left" }}>
      <Strands ambient width={200} height={52} />
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(32px, 5vw, 56px)",
          marginTop: 20,
        }}
      >
        This page isn&apos;t in the briefing.
      </h1>
      <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 16 }}>
        The panel couldn&apos;t find anything at this address.
      </p>
      <Link href="/" className="btn" style={{ display: "inline-block", marginTop: 28 }}>
        Back to today
      </Link>
    </div>
  );
}
