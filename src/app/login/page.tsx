import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <header className="mb-8">
        {/* MU eyebrow — red leading bar */}
        <div className="mb-3 flex items-center gap-3">
          <span className="h-5 w-1 bg-primary" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Restricted area
          </span>
        </div>
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
