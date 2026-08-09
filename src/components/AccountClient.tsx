"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { SECTIONS } from "@/lib/data";
import Strands from "./Strands";

const DELIVERY_HOURS = [5, 6, 7, 8, 9, 10];

interface Profile {
  topics: string[];
  delivery_hour: number;
  is_premium: boolean;
  premium_until: string | null;
  trial_started_at: string | null;
}

const DEFAULT_PROFILE: Profile = {
  topics: ["geopolitics", "markets", "tech"],
  delivery_hour: 5,
  is_premium: false,
  premium_until: null,
  trial_started_at: null,
};

function hourLabel(h: number) {
  return `${h}:00 AM PT`;
}

export default function AccountClient() {
  const sb = supabaseBrowser();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  const loadProfile = useCallback(
    async (s: Session) => {
      if (!sb) return;
      const { data } = await sb
        .from("nn_subscribers")
        .select("topics, delivery_hour, is_premium, premium_until, trial_started_at")
        .eq("user_id", s.user.id)
        .maybeSingle();
      if (data) setProfile({ ...DEFAULT_PROFILE, ...data });
    },
    [sb]
  );

  useEffect(() => {
    if (!sb) { setReady(true); return; }
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session);
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) loadProfile(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [sb, loadProfile]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setNotice("Check your email — we sent a confirmation link. Click it, then sign in here.");
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile() {
    if (!sb || !session) return;
    setBusy(true); setError(""); setSaved(false);
    const { error } = await sb.rpc("nn_claim_profile", {
      p_email: session.user.email,
      p_topics: profile.topics,
      p_delivery_hour: profile.delivery_hour,
    });
    if (error) setError(error.message);
    else { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    setBusy(false);
  }

  async function startTrial() {
    if (!sb || !session) return;
    setBusy(true); setError("");
    // Ensure the profile row exists before starting the trial.
    await sb.rpc("nn_claim_profile", {
      p_email: session.user.email,
      p_topics: profile.topics,
      p_delivery_hour: profile.delivery_hour,
    });
    const { data, error } = await sb.rpc("nn_start_trial");
    if (error) setError(error.message.includes("already used") ? "You've already used your free trial." : error.message);
    else {
      setProfile((p) => ({ ...p, premium_until: data as string, trial_started_at: new Date().toISOString() }));
      setNotice("Premium is on! Your 3-day trial is live — tomorrow's briefing arrives early, with the spoken edition.");
    }
    setBusy(false);
  }

  const premiumActive =
    profile.is_premium ||
    (profile.premium_until !== null && new Date(profile.premium_until) > new Date());
  const trialUsed = profile.trial_started_at !== null;

  if (!ready) return <div className="page" style={{ padding: "80px 0" }} />;

  /* ── Signed out: create account / sign in ── */
  if (!session) {
    return (
      <div className="page">
        <header className="article-header rise">
          <span className="eyebrow">Account</span>
          <h1 style={{ marginTop: 10 }}>
            {mode === "signup" ? <>Get the briefing, <em>your way.</em></> : <>Welcome <em>back.</em></>}
          </h1>
          <p className="dek" style={{ fontSize: 17, marginTop: 14, maxWidth: 560 }}>
            One account: pick your sections, choose when the briefing lands,
            and try Premium free for 3 days.
          </p>
          <Strands ambient width={200} height={52} />
        </header>

        <div style={{ marginTop: 36, maxWidth: 440 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
            {(["signup", "signin"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(""); setNotice(""); }}
                className="topic-check"
                style={mode === m ? { borderColor: "var(--ink)", boxShadow: "inset 0 0 0 1px var(--ink)" } : undefined}
              >
                {m === "signup" ? "Create account" : "Sign in"}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} style={{ display: "grid", gap: 16 }}>
            <div className="field">
              <label htmlFor="email" className="eyebrow">Email</label>
              <input id="email" type="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="password" className="eyebrow">Password</label>
              <input id="password" type="password" required minLength={8}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ fontFamily: "var(--font-ui)", fontSize: 15, padding: "12px 14px", border: "1px solid var(--hairline-2)", borderRadius: 4, background: "var(--paper)", color: "var(--ink)" }} />
            </div>
            {error && <p role="alert" style={{ color: "#b4543e", fontSize: 14 }}>{error}</p>}
            {notice && <p role="status" style={{ color: "var(--live)", fontSize: 14 }}>{notice}</p>}
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "One moment…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Signed in: settings ── */
  return (
    <div className="page">
      <header className="article-header rise">
        <span className="eyebrow">Account · {session.user.email}</span>
        <h1 style={{ marginTop: 10 }}>Your briefing, <em>your rules.</em></h1>
      </header>

      <div style={{ marginTop: 36, maxWidth: 620, display: "grid", gap: 36 }}>
        {/* Sections */}
        <section>
          <span className="eyebrow">Sections</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {SECTIONS.map((s) => (
              <label key={s.slug} className="topic-check">
                <input
                  type="checkbox"
                  checked={profile.topics.includes(s.slug)}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      topics: e.target.checked
                        ? [...p.topics, s.slug]
                        : p.topics.filter((t) => t !== s.slug),
                    }))
                  }
                />
                {s.name}
              </label>
            ))}
          </div>
        </section>

        {/* Delivery time */}
        <section>
          <span className="eyebrow">When should the briefing arrive?</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {DELIVERY_HOURS.map((h) => (
              <label key={h} className="topic-check">
                <input
                  type="radio"
                  name="delivery"
                  checked={profile.delivery_hour === h}
                  onChange={() => setProfile((p) => ({ ...p, delivery_hour: h }))}
                />
                {hourLabel(h)}
              </label>
            ))}
          </div>
          <p className="mono" style={{ marginTop: 10, color: "var(--ink-3)" }}>
            Premium lands on the hour. Free edition follows 30 minutes later.
          </p>
        </section>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn" type="button" onClick={saveProfile} disabled={busy}>
            {busy ? "Saving…" : "Save preferences"}
          </button>
          {saved && <span className="mono" style={{ color: "var(--live)" }}>Saved.</span>}
        </div>

        {/* Premium */}
        <section
          style={{ padding: "clamp(22px, 3vw, 32px)", background: "var(--paper-2)", borderRadius: 6 }}
        >
          <span className="eyebrow">
            Premium — $7.99/month
            {premiumActive && " · active"}
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 24, margin: "10px 0 12px" }}>
            {premiumActive ? <>You&apos;re on the early edition.</> : <>Earlier. <em>And out loud.</em></>}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
            {[
              "AI voice reads the whole briefing to you — every story, right from the email",
              "Briefing lands 30 minutes before the free edition",
              "Completely ad-free, forever",
              "The full six-model panel with complete takes and outlier notes",
            ].map((perk) => (
              <li key={perk} style={{ fontSize: 14.5, color: "var(--ink-2)", paddingLeft: 18, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, top: 8, width: 7, height: 7, borderRadius: "50%", background: "var(--live)" }} aria-hidden="true" />
                {perk}
              </li>
            ))}
          </ul>

          {premiumActive ? (
            <p className="mono" style={{ marginTop: 16, color: "var(--ink-2)" }}>
              {profile.is_premium
                ? "Premium subscription active."
                : `Trial active until ${new Date(profile.premium_until!).toLocaleString("en-US", { month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}.`}
            </p>
          ) : (
            <div style={{ marginTop: 18 }}>
              {!trialUsed ? (
                <>
                  <button className="btn" type="button" onClick={startTrial} disabled={busy}>
                    {busy ? "One moment…" : "Start 3-day free trial"}
                  </button>
                  <p className="mono" style={{ marginTop: 10, color: "var(--ink-3)" }}>
                    No card required. $7.99/mo after the trial — cancel anytime.
                  </p>
                </>
              ) : (
                <p className="mono" style={{ color: "var(--ink-3)" }}>
                  Your trial has ended. Paid subscriptions open soon — you&apos;ll get first access.
                </p>
              )}
            </div>
          )}
          {notice && <p role="status" style={{ marginTop: 12, color: "var(--live)", fontSize: 14 }}>{notice}</p>}
          {error && <p role="alert" style={{ marginTop: 12, color: "#b4543e", fontSize: 14 }}>{error}</p>}
        </section>

        <button
          type="button"
          onClick={() => sb?.auth.signOut()}
          className="mono"
          style={{ background: "none", border: 0, color: "var(--ink-3)", cursor: "pointer", textAlign: "left", padding: 0 }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
