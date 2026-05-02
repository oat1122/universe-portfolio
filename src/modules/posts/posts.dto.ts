import { z } from "zod";
import type { TiptapDoc } from "@/shared/lib/tiptap";

// Tiptap nodes are recursive — Zod can't infer the recursive shape from a flat
// schema, so we keep validation light and trust editorExtensions to reject
// foreign nodes when generateHTML runs at render time.
const tiptapDocSchema = z
  .string()
  .min(1)
  .transform((raw, ctx): TiptapDoc => {
    try {
      const parsed = JSON.parse(raw);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        parsed.type === "doc" &&
        (parsed.content === undefined || Array.isArray(parsed.content))
      ) {
        return parsed as TiptapDoc;
      }
      ctx.addIssue({ code: "custom", message: "Invalid editor document" });
      return z.NEVER;
    } catch {
      ctx.addIssue({ code: "custom", message: "Editor content is not valid JSON" });
      return z.NEVER;
    }
  });

export const createPostDto = z.object({
  title: z.string().min(1).max(200),
  content: tiptapDocSchema,
  excerpt: z.string().max(500).optional(),
  coverImage: z.url().optional(),
  coverImageAlt: z.string().max(200).optional(),
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
