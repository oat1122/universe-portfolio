import Link from "next/link";
import { notFound } from "next/navigation";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { requireAdmin } from "@/modules/auth";
import { postsService } from "@/modules/posts";
import { ForbiddenError, NotFoundError } from "@/shared/errors";
import { PostForm } from "../../post-form";

export const metadata = {
  title: "Edit post",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireAdmin();

  let post: Awaited<ReturnType<typeof postsService.getOwnedById>>;
  try {
    post = await postsService.getOwnedById(id, user.profile.id);
  } catch (e) {
    // Treat both "not found" and "not your post" as 404 — don't reveal the
    // existence of someone else's post.
    if (e instanceof NotFoundError || e instanceof ForbiddenError) notFound();
    throw e;
  }

  return (
    <section className="mx-auto max-w-3xl">
      <header className="mb-6">
        <EyebrowLabel className="mb-2">Edit</EyebrowLabel>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{post.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Link
            href="/admin/posts"
            className="transition-colors duration-150 hover:text-foreground"
          >
            ← Back to posts
          </Link>
          <span aria-hidden>·</span>
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener"
            className="transition-colors duration-150 hover:text-foreground"
          >
            View public page ↗
          </Link>
        </div>
      </header>

      <PostForm post={post} />
    </section>
  );
}
