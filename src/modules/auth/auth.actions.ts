"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logger } from "@/shared/lib/logger";
import { loginDto } from "./auth.dto";
import { authService } from "./auth.service";
import type { LoginResult } from "./auth.types";

export async function loginAction(
  _prev: LoginResult | null,
  formData: FormData,
): Promise<LoginResult> {
  const parsed = loginDto.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Invalid email or password format" };
  }

  const { error } = await authService.signInWithPassword(parsed.data);
  if (error) {
    // Don't echo Supabase's raw message — could leak user existence (enumeration).
    logger.warn({ event: "login_failed" }, "login attempt failed");
    return { ok: false, error: "Invalid email or password" };
  }

  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  await authService.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
