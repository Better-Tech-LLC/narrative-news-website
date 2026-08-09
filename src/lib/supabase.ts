import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. Returns null when env vars aren't set,
 * so the site runs (and builds) without a backend during development.
 *
 * Tables are prefixed nn_ (see supabase/schema.sql), following the
 * Better Tech convention of prefixed tables in the shared project.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
