"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/modules/auth";
import { AppError } from "@/shared/errors";
import { logger } from "@/shared/lib/logger";
import { createPostDto, updatePostDto } from "./posts.dto";
import { postsService } from "./posts.service";

// Discriminated union — Client form reads `state.error` to render messages,
// `state.fieldErrors` for per-field hints. Server-side success = redirect, so
// the caller never observes `{ ok: true }` directly for create/update.
export type PostActionState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }
  | null;

function fail(error: string, fieldErrors?: Record<string, string[]>): PostActionState {
  return { ok: false, error, fieldErrors };
}

function readFormBody(formData: FormData): {
  title: unknown;
  content: unknown;
  excerpt: unknown;
  coverImage: unknown;
  published: unknown;
} {
  const trim = (v: FormDataEntryValue | null) =>
    typeof v === "string" ? (v.trim() === "" ? undefined : v.trim()) : undefined;
  return {
    title: trim(formData.get("title")),
    content: trim(formData.get("content")),
    excerpt: trim(formData.get("excerpt")),
    coverImage: trim(formData.get("coverImage")),
    published: formData.get("published") === "on",
  };
}

export async function createPostAction(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const user = await requireAdmin();

  const parsed = createPostDto.safeParse(readFormBody(formData));
  if (!parsed.success) {
    return fail("Invalid input", parsed.error.flatten().fieldErrors);
  }

  try {
    const post = await postsService.createForAuthor(user.profile.id, parsed.data);
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    redirect(`/admin/posts/${post.id}/edit`);
  } catch (e) {
    if (e instanceof AppError) return fail(e.message);
    logger.error(
      { errName: e instanceof Error ? e.name : "UnknownError" },
      "createPostAction failed",
    );
    return fail("Could not create post");
  }
}

export async function updatePostAction(
  id: string,
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const user = await requireAdmin();

  const parsed = updatePostDto.safeParse(readFormBody(formData));
  if (!parsed.success) {
    return fail("Invalid input", parsed.error.flatten().fieldErrors);
  }

  try {
    const post = await postsService.updateById(id, user.profile.id, parsed.data);
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { ok: true };
  } catch (e) {
    if (e instanceof AppError) return fail(e.message);
    logger.error(
      { errName: e instanceof Error ? e.name : "UnknownError", postId: id },
      "updatePostAction failed",
    );
    return fail("Could not update post");
  }
}

export async function deletePostAction(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return; // Silently ignore — invalid form, nothing actionable
  }

  try {
    await postsService.deleteById(id, user.profile.id);
  } catch (e) {
    if (!(e instanceof AppError)) {
      logger.error(
        { errName: e instanceof Error ? e.name : "UnknownError", postId: id },
        "deletePostAction failed",
      );
    }
    // Either way, stay on /admin/posts — redirect below handles it
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  redirect("/admin/posts");
}

export async function togglePublishAction(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) return;

  try {
    const post = await postsService.togglePublish(id, user.profile.id);
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
  } catch (e) {
    if (!(e instanceof AppError)) {
      logger.error(
        { errName: e instanceof Error ? e.name : "UnknownError", postId: id },
        "togglePublishAction failed",
      );
    }
  }
}
