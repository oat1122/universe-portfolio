import { z } from "zod";

export const createPostDto = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
});

export const updatePostDto = createPostDto.partial();

export const listPostsDto = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreatePostDto = z.infer<typeof createPostDto>;
export type UpdatePostDto = z.infer<typeof updatePostDto>;
export type ListPostsDto = z.infer<typeof listPostsDto>;
