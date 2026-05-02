import Link from "next/link";
import { logoutAction, requireAdmin } from "@/modules/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="font-bold tracking-tight">
              Admin
            </Link>
            <nav className="flex gap-4 text-sm text-neutral-600">
              <Link href="/admin/dashboard" className="hover:text-neutral-900">
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-neutral-500">{user.profile.displayName}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded border border-neutral-300 px-3 py-1 text-neutral-700 hover:bg-neutral-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
