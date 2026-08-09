import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. Returns null when env vars aren't set,
 * so the site runs (and builds) without a backend during development.
 *
 * Dedicated project (nn_ tables — see supabase/schema.sql). Writes go
 * through SECURITY DEFINER functions, so the publishable key is enough;
 * a service-role key is used instead if one is ever configured.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
