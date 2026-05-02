"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
// Server Actions must be imported direct from *.actions.ts (not via the module barrel),
// otherwise the bundler follows the barrel into server-only deps (next/headers, postgres).
// See: rules/module-pattern.md "Server Action import exception".
import { loginAction } from "@/modules/auth/auth.actions";
import type { LoginResult } from "@/modules/auth/auth.types";

const inputClass =
  "rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const labelClass = "text-xs font-medium uppercase tracking-wide text-muted-foreground";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginResult | null, FormData>(
    loginAction,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Email</span>
        <input type="email" name="email" required autoComplete="email" className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Password</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="current-password"
          className={inputClass}
        />
      </label>

      {state && !state.ok && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
