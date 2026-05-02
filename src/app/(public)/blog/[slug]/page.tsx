import { notFound } from "next/navigation";
import { postsService } from "@/modules/posts";
import { NotFoundError } from "@/shared/errors";
import { formatDate } from "@/shared/utils/date";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof postsService.getPublishedBySlug>>;
  try {
    post = await postsService.getPublishedBySlug(slug);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {post.coverImage && (
        // biome-ignore lint/performance/noImgElement: cover image is external (Supabase Storage); next/image config TBD
        <img
          src={post.coverImage}
          alt=""
          className="mb-8 aspect-video w-full rounded-xl border border-border object-cover"
        />
      )}

      <header className="mb-8 border-b border-border pb-6">
        {/* MU eyebrow — red leading bar */}
        <div className="mb-3 flex items-center gap-3">
          <span className="h-5 w-1 bg-primary" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Article
          </span>
        </div>

        <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mb-4 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {post.author.avatarUrl && (
            // biome-ignore lint/performance/noImgElement: author avatar is external (Supabase Storage)
            <img
              src={post.author.avatarUrl}
              alt=""
              className="h-8 w-8 rounded-full border border-border object-cover"
            />
          )}
          <span className="font-medium text-foreground">{post.author.displayName}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt?.toISOString() ?? post.createdAt.toISOString()}>
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{post.views.toLocaleString()} views</span>
        </div>
      </header>

      {/* Plain-text rendering for now — MDX rendering arrives with the content module. */}
      <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
        {post.content}
      </div>
    </article>
  );
}
