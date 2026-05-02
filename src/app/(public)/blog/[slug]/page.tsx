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
          className="mb-8 aspect-video w-full rounded-lg object-cover"
        />
      )}

      <header className="mb-8 border-b pb-6">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">{post.title}</h1>
        {post.excerpt && <p className="mb-4 text-lg text-neutral-600">{post.excerpt}</p>}
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          {post.author.avatarUrl && (
            // biome-ignore lint/performance/noImgElement: author avatar is external (Supabase Storage)
            <img src={post.author.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
          )}
          <span>{post.author.displayName}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt?.toISOString() ?? post.createdAt.toISOString()}>
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
          <span aria-hidden>·</span>
          <span>{post.views.toLocaleString()} views</span>
        </div>
      </header>

      {/* Plain-text rendering for now — MDX rendering arrives with the content module. */}
      <div className="prose prose-neutral max-w-none whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>
    </article>
  );
}
