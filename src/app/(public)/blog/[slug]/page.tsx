import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichTextRenderer } from "@/components/blog/rich-text-renderer";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SITE_NAME } from "@/config/constants";
import { env } from "@/config/env";
import { postsService } from "@/modules/posts";
import { NotFoundError } from "@/shared/errors";
import { extractTiptapText, truncateForDescription } from "@/shared/lib/tiptap";
import { formatDate } from "@/shared/utils/date";

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await postsService.getPostMetaBySlug(slug);
    const url = `/blog/${post.slug}`;
    // Description priority: explicit excerpt > first chunk of body text > title fallback.
    // Body text comes from Tiptap doc so SEO + JSON-LD stay aligned with rendered HTML.
    const description = post.excerpt ?? truncateForDescription(extractTiptapText(post.content));

    return {
      title: post.title,
      description,
      authors: [{ name: post.author.displayName }],
      alternates: { canonical: url },
      openGraph: {
        title: post.title,
        description,
        type: "article",
        url,
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.author.displayName],
        images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: post.coverImage ? [post.coverImage] : undefined,
      },
    };
  } catch {
    // Don't leak internal errors into metadata; let the page render path handle 404.
    return { title: "Post not found" };
  }
}

export default async function BlogPostPage({ params }: PageParams) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof postsService.getPublishedBySlug>>;
  try {
    post = await postsService.getPublishedBySlug(slug);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }

  // Plain-text body — used by JSON-LD `articleBody` to keep structured data
  // in sync with the rendered HTML (no markup, single-spaced).
  const bodyText = extractTiptapText(post.content);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? truncateForDescription(bodyText),
    articleBody: bodyText,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.displayName,
      url: `${env.NEXT_PUBLIC_SITE_URL}/author/${post.author.username}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: env.NEXT_PUBLIC_SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
    },
  };

  // Escape `<` per Next SEO docs so a stray `</script>` inside a string field
  // can't break out of the JSON-LD block.
  const jsonLdHtml = JSON.stringify(articleJsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered JSON-LD only, escaped
        dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
      />
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
          <EyebrowLabel className="mb-3">Article</EyebrowLabel>

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

        <RichTextRenderer doc={post.content} />
      </article>
    </>
  );
}
