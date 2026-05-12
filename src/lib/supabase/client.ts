import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time on Vercel, these might be missing.
    // Return a proxy or handle it gracefully to avoid crashing the build.
    console.warn("Supabase credentials missing. Client initialization skipped.");
    return null as any;
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
