"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/components/ui/sonner";

// Server Action redirect can't carry toast state — the convention is to put a
// flag in the URL (`?created=<slug>`), let the Server Component pass it in here,
// then this Client Component fires the toast and scrubs the param so refresh
// doesn't re-trigger it.
//
// `id` on toast() de-dupes against React 19 strict-mode's double-effect.
export function CreatedToast({ slug }: { slug: string }) {
  const router = useRouter();

  useEffect(() => {
    toast.success("Post created", {
      id: `post-created-${slug}`,
      description: `/blog/${slug}`,
    });
    router.replace("/admin/posts", { scroll: false });
  }, [slug, router]);

  return null;
}
