"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Single source of truth for admin navigation. Add new admin sections here.
const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin"
      // Inline on mobile (alongside the brand mark), stacked on desktop sidebar.
      className="flex flex-row gap-1 md:w-full md:flex-col md:gap-0.5"
    >
      {NAV_ITEMS.map((item) => {
        // Match exact + nested routes (e.g. /admin/posts/new highlights "Posts")
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
              isActive
                ? "bg-surface-elevated text-foreground"
                : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
