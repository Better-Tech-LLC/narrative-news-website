"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PANEL } from "@/lib/models";
import { CURRENT_ISSUE } from "@/lib/data";
import { supabaseBrowser } from "@/lib/supabase-browser";

const NAV = [
  { href: "/", label: "Today" },
  { href: "/section/geopolitics", label: "Geopolitics" },
  { href: "/section/markets", label: "Markets" },
  { href: "/section/tech", label: "Tech" },
  { href: "/section/sports", label: "Sports" },
  { href: "/models", label: "The Panel" },
  { href: "/archive", label: "Archive" },
];

export default function Masthead() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) { setSignedIn(false); return; }
    sb.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) =>
      setSignedIn(Boolean(session))
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="masthead">
      <div className="page masthead-inner">
        <Link href="/" className="wordmark" aria-label="narrativeNews.dev home">
          <span className="wordmark-strands" aria-hidden="true">
            {PANEL.map((m, i) => (
              <i
                key={m.id}
                style={{
                  background: m.hue,
                  height: `${[16, 11, 14, 9, 13, 10][i]}px`,
                }}
              />
            ))}
          </span>
          narrative<em style={{ fontStyle: "italic" }}>News</em>
          <span className="tld">.dev</span>
        </Link>

        <nav className="mast-nav" aria-label="Main navigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mast-link"
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <span className="mast-date">
          <span className="live-dot" aria-hidden="true" />
          <span className="date-text">{CURRENT_ISSUE.displayDate.toUpperCase()}</span>
        </span>

        <Link
          href="/account"
          className="mast-auth"
          aria-current={pathname === "/account" ? "page" : undefined}
        >
          {signedIn ? "Account" : "Sign in"}
        </Link>
      </div>
    </header>
  );
}
