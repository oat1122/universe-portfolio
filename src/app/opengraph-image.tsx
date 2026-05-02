import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/config/constants";
import { darkTheme } from "@/config/theme";

// Root-level OG image fallback. Pages without their own opengraph-image.tsx
// (or explicit `metadata.openGraph.images`) inherit this one.
// Visual follows ui-style.md MU brand voice — dark surface + red trident accent.

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
      {/* Eyebrow — red leading bar + uppercase label */}
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
          Personal Portfolio · Blog
        </span>
      </div>

      {/* Hero heading */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <h1
          style={{
            fontSize: "104px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: 0,
            color: darkTheme.foreground,
          }}
        >
          {SITE_NAME}
        </h1>
        <p
          style={{
            fontSize: "32px",
            color: darkTheme.mutedForeground,
            margin: 0,
            lineHeight: 1.3,
            maxWidth: "900px",
          }}
        >
          A 3D universe scene, blog, and admin dashboard.
        </p>
      </div>

      {/* Trident accent strip — bottom brand mark */}
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ width: "80px", height: "8px", background: darkTheme.primary }} />
        <div style={{ width: "80px", height: "8px", background: darkTheme.foreground }} />
        <div style={{ width: "80px", height: "8px", background: darkTheme.accent }} />
      </div>
    </div>,
    { ...size },
  );
}
