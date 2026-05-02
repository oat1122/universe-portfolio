import { z } from "zod";
import type { TiptapDoc } from "@/shared/lib/tiptap";

// Tiptap nodes are recursive — Zod can't infer the recursive shape from a flat
// schema, so we keep validation light and trust editorExtensions to reject
// foreign nodes when generateHTML runs at render time.
const tiptapDocSchema = z
  .string({ message: "Content is required" })
  .min(1, "Content cannot be empty")
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
      ctx.addIssue({ code: "custom", message: "Editor content has an invalid shape" });
      return z.NEVER;
    } catch {
      ctx.addIssue({ code: "custom", message: "Editor content is not valid JSON" });
      return z.NEVER;
    }
  });

export const createPostDto = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters"),
  content: tiptapDocSchema,
  excerpt: z.string().max(500, "Excerpt cannot exceed 500 characters").optional(),
  coverImage: z.url({ message: "Cover image must be a valid URL" }).optional(),
  coverImageAlt: z.string().max(200, "Alt text cannot exceed 200 characters").optional(),
  published: z.boolean({ message: "Published flag must be true or false" }).default(false),
});

export const updatePostDto = createPostDto.partial();

export const listPostsDto = z.object({
  limit: z.coerce
    .number({ message: "Limit must be a number" })
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .default(10),
  offset: z.coerce
    .number({ message: "Offset must be a number" })
    .int("Offset must be an integer")
    .min(0, "Offset cannot be negative")
    .default(0),
});

export type CreatePostDto = z.infer<typeof createPostDto>;
export type UpdatePostDto = z.infer<typeof updatePostDto>;
export type ListPostsDto = z.infer<typeof listPostsDto>;
