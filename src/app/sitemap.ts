import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { postsService } from "@/modules/posts";

// Re-fetch published posts hourly so newly-published content appears in the
// sitemap without a full redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  // Pull all published posts. When the catalog grows past a few thousand
  // entries, split into a sitemap index instead.
  const posts = await postsService.listPublished({ limit: 1000, offset: 0 });
  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedAt ?? p.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
