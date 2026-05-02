import type { Metadata } from "next";
import { AccentStripe } from "@/components/ui/accent-stripe";
import { Button } from "@/components/ui/button";
import { logoutAction, requireAdmin } from "@/modules/auth";
import { AdminNav } from "./_components/admin-nav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* Sidebar — collapses to a top bar on mobile, vertical rail on desktop */}
      <aside className="flex flex-row items-center gap-4 border-b border-border bg-surface px-6 py-4 md:h-screen md:w-60 md:flex-shrink-0 md:flex-col md:items-stretch md:gap-6 md:border-b-0 md:border-r md:px-4 md:py-6">
        {/* Brand mark */}
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground md:px-2">
          <span aria-hidden className="h-5 w-1 bg-primary" />
          Admin
        </div>

        <AdminNav />

        {/* Spacer — pushes user block right on mobile, bottom on desktop */}
        <div className="ml-auto md:ml-0 md:mt-auto" />

        <div className="flex items-center gap-3 text-sm md:w-full md:flex-col md:items-start md:gap-3 md:border-t md:border-border md:px-2 md:pt-4">
          <span className="text-muted-foreground">{user.profile.displayName}</span>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>

        {/* Trident brand mark — desktop only (mobile is too tight) */}
        <AccentStripe variant="trident" className="hidden md:flex md:px-2" />
      </aside>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
