import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Sign in</h1>
        <p className="text-sm text-neutral-500">Admin access only.</p>
      </div>
      {error === "no-profile" && (
        <p className="mb-4 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Your account is missing a profile. Contact the site owner.
        </p>
      )}
      <LoginForm />
    </main>
  );
}
