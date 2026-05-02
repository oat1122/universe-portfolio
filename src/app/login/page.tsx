import type { Metadata } from "next";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <header className="mb-8">
        <EyebrowLabel className="mb-3">Restricted area</EyebrowLabel>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Admin access only.</p>
      </header>
      {error === "no-profile" && (
        <p className="mb-4 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
          Your account is missing a profile. Contact the site owner.
        </p>
      )}
      <LoginForm />
    </main>
  );
}
