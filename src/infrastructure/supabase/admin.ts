import "server-only";

import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";

// Service-role Supabase client — bypasses RLS. Use for:
//   - storage uploads from Server Actions (RLS policies are defense-in-depth)
//   - admin user management (createUser, listUsers in seed scripts — but seeds
//     create their own client; this one is for the request lifecycle)
//
// NEVER import this from a Client Component or any module that ships to the
// browser. The `server-only` guard above will throw at build time if it leaks.
export function createAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations");
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
