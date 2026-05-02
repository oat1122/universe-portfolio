import "server-only";

import { redirect } from "next/navigation";
import { authService } from "./auth.service";
import type { SessionUser } from "./auth.types";

// Guards are intended to be called from Server Components / layouts only.
// They redirect on failure and return a narrowed user type on success.

export async function requireUser(): Promise<SessionUser> {
  const user = await authService.getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<
  SessionUser & { profile: NonNullable<SessionUser["profile"]> }
> {
  const user = await requireUser();
  if (!user.profile) redirect("/login?error=no-profile");
  if (user.profile.role !== "admin") redirect("/");
  return { ...user, profile: user.profile };
}
