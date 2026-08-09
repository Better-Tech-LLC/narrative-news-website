"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/newsletter/actions";
import { SECTIONS } from "@/lib/data";

const INITIAL: SubscribeState = { status: "idle", message: "" };

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribe, INITIAL);

  if (state.status === "ok") {
    return (
      <div
        role="status"
        style={{
          padding: "28px",
          background: "var(--paper-2)",
          borderRadius: 6,
          maxWidth: 520,
        }}
      >
        <p style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>
          Subscribed.
        </p>
        <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 15 }}>
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} style={{ maxWidth: 520, display: "grid", gap: 20 }}>
      <div className="field">
        <label htmlFor="email" className="eyebrow">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <fieldset style={{ border: 0, padding: 0 }}>
        <legend className="eyebrow" style={{ marginBottom: 10 }}>
          Sections
        </legend>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SECTIONS.map((s) => (
            <label key={s.slug} className="topic-check">
              <input
                type="checkbox"
                name="topics"
                value={s.slug}
                defaultChecked={s.slug !== "sports"}
              />
              {s.name}
            </label>
          ))}
        </div>
      </fieldset>

      {state.status === "error" && (
        <p role="alert" style={{ color: "#b4543e", fontSize: 14 }}>
          {state.message}
        </p>
      )}

      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Signing up…" : "Get the briefing"}
      </button>
    </form>
  );
}
