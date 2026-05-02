"use client";

import { useActionState } from "react";
// Server Actions must be imported direct from *.actions.ts (not via the module barrel),
// otherwise the bundler follows the barrel into server-only deps (next/headers, postgres).
// See: rules/module-pattern.md "Server Action import exception".
import { loginAction } from "@/modules/auth/auth.actions";
import type { LoginResult } from "@/modules/auth/auth.types";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginResult | null, FormData>(
    loginAction,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="rounded border border-neutral-300 px-3 py-2 focus:border-neutral-900 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Password</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="current-password"
          className="rounded border border-neutral-300 px-3 py-2 focus:border-neutral-900 focus:outline-none"
        />
      </label>

      {state && !state.ok && (
        <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
