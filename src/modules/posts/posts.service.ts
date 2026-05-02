import { NotFoundError } from "@/shared/errors";
import { logger } from "@/shared/lib/logger";
import { postsRepository } from "./posts.repository";
import type { PostWithAuthor } from "./posts.types";

export const postsService = {
  // Read without side effects — safe for `generateMetadata` and any caller that
  // shouldn't trigger view counting (preview, analytics, etc.).
  async getPostMetaBySlug(slug: string): Promise<PostWithAuthor> {
    const post = await postsRepository.findPublishedBySlug(slug);
    if (!post) throw new NotFoundError("Post not found");
    return post;
  },

  // Read + best-effort view increment — used by the actual page render.
  async getPublishedBySlug(slug: string): Promise<PostWithAuthor> {
    const post = await this.getPostMetaBySlug(slug);

    // View counter is a best-effort side effect: a write failure here must not
    // mask a successful read for the user. Log and continue.
    try {
      await postsRepository.incrementViews(post.id);
    } catch (err) {
      const errName = err instanceof Error ? err.name : "UnknownError";
      logger.warn({ postId: post.id, errName }, "failed to increment post views");
    }

    return post;
  },

  async listPublished(input: { limit: number; offset: number }): Promise<PostWithAuthor[]> {
    return postsRepository.findPublishedList(input.limit, input.offset);
  },
};
