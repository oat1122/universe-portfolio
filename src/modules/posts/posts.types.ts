import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { Profile } from "@/modules/profiles";
import type { posts } from "./posts.schema";

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

// Caller never supplies these — id, slug, views default in DB; publishedAt is set
// by the service when `published` flips to true; timestamps are managed automatically.
export type CreatePostInput = Omit<
  NewPost,
  "id" | "slug" | "views" | "publishedAt" | "createdAt" | "updatedAt"
>;

// Shape returned to public read endpoints — joins profiles to surface byline data
// without leaking the rest of the author profile (e.g. bio, email).
export type PostWithAuthor = Post & {
  author: Pick<Profile, "id" | "username" | "displayName" | "avatarUrl">;
};
