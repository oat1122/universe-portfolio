import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/infrastructure/db/client";
import { profiles } from "@/modules/profiles/profiles.schema";
import { posts } from "./posts.schema";
import type { Post, PostWithAuthor } from "./posts.types";

// Author projection shared by every joined query — keeps it in sync with PostWithAuthor.
const authorProjection = {
  id: profiles.id,
  username: profiles.username,
  displayName: profiles.displayName,
  avatarUrl: profiles.avatarUrl,
} as const;

export const postsRepository = {
  async findBySlug(slug: string): Promise<Post | null> {
    const [row] = await db.select().from(posts).where(eq(posts.slug, slug));
    return row ?? null;
  },

  async findPublishedBySlug(slug: string): Promise<PostWithAuthor | null> {
    const [row] = await db
      .select({
        post: posts,
        author: authorProjection,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.authorId, profiles.id))
      .where(and(eq(posts.slug, slug), eq(posts.published, true)));

    if (!row || !row.author) return null;
    return { ...row.post, author: row.author };
  },

  async findPublishedList(limit: number, offset: number): Promise<PostWithAuthor[]> {
    const rows = await db
      .select({
        post: posts,
        author: authorProjection,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.authorId, profiles.id))
      .where(eq(posts.published, true))
      // NULLS LAST keeps any (theoretically impossible) published rows without
      // publishedAt at the bottom rather than the top of the feed.
      .orderBy(sql`${posts.publishedAt} desc nulls last`, desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return rows
      .filter((r): r is { post: Post; author: NonNullable<typeof r.author> } => r.author !== null)
      .map((r) => ({ ...r.post, author: r.author }));
  },

  async incrementViews(id: string): Promise<void> {
    await db
      .update(posts)
      .set({ views: sql`${posts.views} + 1` })
      .where(eq(posts.id, id));
  },
};
