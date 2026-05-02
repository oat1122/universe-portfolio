import type { Metadata } from "next";
import { Bai_Jamjuree, JetBrains_Mono } from "next/font/google";
import { SITE_NAME } from "@/config/constants";
import { env } from "@/config/env";
import "./globals.css";

// Bai Jamjuree covers both display headings (700) and body text (400-500),
// with native Thai support — single family keeps the bundle lean.
// Variable name is namespaced (--font-bai-jamjuree) to avoid colliding with
// Tailwind's own --font-sans token defined in globals.css @theme.
const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: "Personal portfolio + blog with a 3D universe scene.",
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

// Runs before React hydrates: sets data-theme from localStorage so the page
// doesn't flash the wrong palette on load. Falls through to the prefers-color-scheme
// media query in globals.css when no explicit choice is stored.
const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning on <html>: themeInitScript mutates data-theme before
  // React hydrates, so the attribute diff is expected. Scope is html-level only —
  // children are still checked strictly.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${baiJamjuree.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: tiny static script for theme init (no user input) */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
