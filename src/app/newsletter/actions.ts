"use server";

import { getSupabase } from "@/lib/supabase";

export interface SubscribeState {
  status: "idle" | "ok" | "error";
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TOPICS = new Set(["geopolitics", "markets", "tech", "sports"]);

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const topics = formData
    .getAll("topics")
    .map(String)
    .filter((t) => VALID_TOPICS.has(t));

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }
  if (topics.length === 0) {
    return { status: "error", message: "Pick at least one section." };
  }

  const supabase = getSupabase();
  if (!supabase) {
    // Backend not wired yet — dev fallback so the flow is testable.
    console.log("[newsletter] (no supabase env) would subscribe:", email, topics);
    return {
      status: "ok",
      message: "You're on the list. First briefing lands tomorrow morning.",
    };
  }

  const { error } = await supabase.rpc("nn_subscribe", {
    p_email: email,
    p_topics: topics,
  });

  if (error) {
    console.error("[newsletter] subscribe failed:", error.message);
    return {
      status: "error",
      message: "Something went wrong saving your subscription. Try again.",
    };
  }

  return {
    status: "ok",
    message: "You're on the list. First briefing lands tomorrow morning.",
  };
}
