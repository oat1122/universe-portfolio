import "server-only";

import { createClient } from "@/infrastructure/supabase/server";
import { profilesService } from "@/modules/profiles";
import { NotFoundError } from "@/shared/errors";
import type { SessionUser } from "./auth.types";

export const authService = {
  // Returns the current Supabase auth user paired with their profile, or null if signed out.
  // Always uses getUser() (not getSession()) — getUser() re-validates the JWT against the
  // Supabase server, which is the only way to trust the identity in a Server Component.
  async getCurrentUser(): Promise<SessionUser | null> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    let profile = null;
    try {
      profile = await profilesService.getById(user.id);
    } catch (e) {
      // Brand-new auth user without a profile row yet — caller decides what to do
      if (!(e instanceof NotFoundError)) throw e;
    }

    return {
      id: user.id,
      email: user.email ?? null,
      profile,
    };
  },

  async signInWithPassword(input: {
    email: string;
    password: string;
  }): Promise<{ error?: string }> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(input);
    if (error) return { error: error.message };
    return {};
  },

  async signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
  },
};
