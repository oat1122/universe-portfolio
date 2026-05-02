import Link from "next/link";
import { logoutAction, requireAdmin } from "@/modules/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground"
            >
              <span className="h-5 w-1 bg-primary" />
              Admin
            </Link>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link
                href="/admin/dashboard"
                className="transition-colors duration-150 hover:text-foreground"
              >
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{user.profile.displayName}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-border bg-background px-3 py-1.5 text-foreground transition-colors duration-150 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        {/* Trident accent strip — sub-header brand mark */}
        <div className="flex h-1 gap-1 px-6 pb-1">
          <span className="h-full w-8 bg-primary" />
          <span className="h-full w-8 bg-foreground" />
          <span className="h-full w-8 bg-accent" />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
