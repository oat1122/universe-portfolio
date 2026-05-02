import type { Metadata } from "next";
import Link from "next/link";
import { AccentStripe } from "@/components/ui/accent-stripe";
import { Button } from "@/components/ui/button";
import { logoutAction, requireAdmin } from "@/modules/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

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
              <span aria-hidden className="h-5 w-1 bg-primary" />
              Admin
            </Link>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link
                href="/admin/dashboard"
                className="transition-colors duration-150 hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/posts"
                className="transition-colors duration-150 hover:text-foreground"
              >
                Posts
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{user.profile.displayName}</span>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
        {/* Trident accent strip — sub-header brand mark */}
        <AccentStripe variant="trident" className="mx-6 pb-1" />
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
