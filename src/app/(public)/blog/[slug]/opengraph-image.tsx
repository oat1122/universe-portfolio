import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/config/constants";
import { darkTheme } from "@/config/theme";
import { postsService } from "@/modules/posts";
import { NotFoundError } from "@/shared/errors";
import { formatDate } from "@/shared/utils/date";

// Per-post OG image — rendered on demand when a social platform fetches
// /blog/<slug>/opengraph-image. Inherits brand voice from the root OG:
// eyebrow + headline + trident strip, dark surface, MU red accent.

export const alt = "Article on Universe Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

// Title sizing scales down for long titles so they don't overflow the canvas
function titleFontSize(title: string): number {
  const len = title.length;
  if (len <= 40) return 88;
  if (len <= 70) return 72;
  if (len <= 100) return 60;
  return 52;
}

export default async function OGImage({ params }: Props) {
  const { slug } = await params;

  let title: string;
  let authorName: string | null = null;
  let dateLabel: string | null = null;

  try {
    const post = await postsService.getPostMetaBySlug(slug);
    title = post.title;
    authorName = post.author.displayName;
    dateLabel = formatDate(post.publishedAt ?? post.createdAt);
  } catch (e) {
    // Graceful fallback when slug is missing or unpublished — still ship a
    // branded image so social previews don't break with a 404.
    if (!(e instanceof NotFoundError)) throw e;
    title = "Post not found";
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: darkTheme.background,
        color: darkTheme.foreground,
        fontFamily: "sans-serif",
      }}
    >
      {/* Top — eyebrow with MU red leading bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "8px", height: "40px", background: darkTheme.primary }} />
        <span
          style={{
            fontSize: "20px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: darkTheme.mutedForeground,
            fontWeight: 500,
          }}
        >
          Article · {SITE_NAME}
        </span>
      </div>

      {/* Middle — post title (sized to avoid overflow) */}
      <h1
        style={{
          fontSize: `${titleFontSize(title)}px`,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: 0,
          color: darkTheme.foreground,
          // Cap at 4 lines so very-long titles don't push the trident off-screen
          display: "flex",
          maxHeight: "350px",
          overflow: "hidden",
        }}
      >
        {title}
      </h1>

      {/* Bottom — meta row + trident */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {(authorName || dateLabel) && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              fontSize: "24px",
              color: darkTheme.mutedForeground,
            }}
          >
            {authorName && <span style={{ color: darkTheme.foreground }}>{authorName}</span>}
            {authorName && dateLabel && <span aria-hidden>·</span>}
            {dateLabel && <span>{dateLabel}</span>}
          </div>
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ width: "80px", height: "8px", background: darkTheme.primary }} />
          <div style={{ width: "80px", height: "8px", background: darkTheme.foreground }} />
          <div style={{ width: "80px", height: "8px", background: darkTheme.accent }} />
        </div>
      </div>
    </div>,
    { ...size },
  );
}
