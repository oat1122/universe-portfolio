import type { Profile } from "@/modules/profiles";

// The pair of identity records the app cares about: Supabase auth user (email, id)
// joined with the public-facing profile (username, displayName, role).
// `profile` is null only during the brief window between auth.users insert and
// profile row creation — guards must treat that case as "not yet onboarded".
export type SessionUser = {
  id: string;
  email: string | null;
  profile: Profile | null;
};

export type LoginResult = { ok: true } | { ok: false; error: string };
