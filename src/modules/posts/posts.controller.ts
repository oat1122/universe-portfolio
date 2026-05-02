import type { NextResponse } from "next/server";
import { badRequest, handleError, ok } from "@/shared/lib/api-response";
import { listPostsDto } from "./posts.dto";
import { postsService } from "./posts.service";

export const postsController = {
  async getBySlug(slug: string): Promise<NextResponse> {
    try {
      const post = await postsService.getPublishedBySlug(slug);
      return ok(post);
    } catch (e) {
      return handleError(e);
    }
  },

  async list(req: Request): Promise<NextResponse> {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = listPostsDto.safeParse(params);
    if (!parsed.success) return badRequest(parsed.error);

    try {
      const posts = await postsService.listPublished(parsed.data);
      return ok(posts);
    } catch (e) {
      return handleError(e);
    }
  },
};
