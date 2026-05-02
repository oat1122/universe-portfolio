import { ConflictError, ForbiddenError, NotFoundError } from "@/shared/errors";
import { logger } from "@/shared/lib/logger";
import { generateSlug } from "@/shared/utils/slug";
import type { CreatePostDto, UpdatePostDto } from "./posts.dto";
import { postsRepository } from "./posts.repository";
import type { Post, PostWithAuthor } from "./posts.types";

// Helper: enforce that the actor owns the post before mutate. Throws domain
// errors so callers don't need to repeat the check.
async function requireOwnedPost(id: string, authorId: string): Promise<Post> {
  const post = await postsRepository.findById(id);
  if (!post) throw new NotFoundError("Post not found");
  if (post.authorId !== authorId) throw new ForbiddenError("Not your post");
  return post;
}

export const postsService = {
  // ── Public reads ────────────────────────────────────────────────────────────

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

  // ── Admin reads ─────────────────────────────────────────────────────────────

  async listAllForAuthor(authorId: string): Promise<Post[]> {
    return postsRepository.findAllForAuthor(authorId);
  },

  async getOwnedById(id: string, authorId: string): Promise<Post> {
    return requireOwnedPost(id, authorId);
  },

  // ── Mutations ───────────────────────────────────────────────────────────────

  async createForAuthor(authorId: string, input: CreatePostDto): Promise<Post> {
    const slug = generateSlug(input.title);
    if (!slug) throw new ConflictError("Title must contain at least one word character");

    // Slug uniqueness is enforced at DB level, but checking up front lets us
    // return a clear domain error instead of leaking the constraint name.
    const existing = await postsRepository.findBySlug(slug);
    if (existing) throw new ConflictError("A post with this title already exists");

    return postsRepository.create({
      title: input.title,
      slug,
      // input.content is already a TiptapDoc (transformed by createPostDto)
      content: input.content,
      excerpt: input.excerpt ?? null,
      coverImage: input.coverImage ?? null,
      published: input.published,
      authorId,
      // First-publish stamp; updateById preserves it across re-publish toggles.
      publishedAt: input.published ? new Date() : null,
    });
  },

  async updateById(id: string, authorId: string, input: UpdatePostDto): Promise<Post> {
    const current = await requireOwnedPost(id, authorId);

    // Stamp publishedAt the first time `published` flips true, but never clear
    // it — keeps history of when the post first went live.
    let publishedAt = current.publishedAt;
    if (input.published === true && !current.published && !publishedAt) {
      publishedAt = new Date();
    }

    // Slug is immutable — title can change, URL stays. Drop title-driven slug
    // regeneration on purpose to keep links stable.
    const updated = await postsRepository.update(id, {
      title: input.title,
      content: input.content,
      excerpt: input.excerpt,
      coverImage: input.coverImage,
      published: input.published,
      publishedAt,
    });
    if (!updated) throw new NotFoundError("Post not found");
    return updated;
  },

  async deleteById(id: string, authorId: string): Promise<void> {
    await requireOwnedPost(id, authorId);
    await postsRepository.delete(id);
  },

  async togglePublish(id: string, authorId: string): Promise<Post> {
    const current = await requireOwnedPost(id, authorId);
    return this.updateById(id, authorId, { published: !current.published });
  },
};
