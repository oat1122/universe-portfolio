import { NotFoundError } from "@/shared/errors";
import { logger } from "@/shared/lib/logger";
import { postsRepository } from "./posts.repository";
import type { PostWithAuthor } from "./posts.types";

export const postsService = {
  async getPublishedBySlug(slug: string): Promise<PostWithAuthor> {
    const post = await postsRepository.findPublishedBySlug(slug);
    if (!post) throw new NotFoundError("Post not found");

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
