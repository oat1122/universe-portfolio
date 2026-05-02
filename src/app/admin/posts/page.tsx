import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { requireAdmin } from "@/modules/auth";
import { postsService } from "@/modules/posts";
import { formatDate } from "@/shared/utils/date";
import { PostRowActions } from "./post-row-actions";

export default async function AdminPostsPage() {
  const user = await requireAdmin();
  const posts = await postsService.listAllForAuthor(user.profile.id);

  return (
    <section>
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <EyebrowLabel className="mb-2">Content</EyebrowLabel>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Posts</h1>
        </div>
        <Link href="/admin/posts/new" className={buttonVariants({ variant: "default" })}>
          + New post
        </Link>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-sm text-muted-foreground">
          No posts yet — create your first one.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-elevated text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-right font-medium">Views</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((p) => (
                <tr key={p.id} className="text-foreground">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="font-medium transition-colors duration-150 hover:text-primary"
                    >
                      {p.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-border" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(p.createdAt)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {p.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <PostRowActions id={p.id} title={p.title} published={p.published} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
