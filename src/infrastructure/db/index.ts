// Aggregate every module's *.schema.ts here so drizzle-kit can discover them.
//
// MUST add a re-export line each time you create a new schema file:
//   export * from "@/modules/posts/posts.schema";
//   export * from "@/modules/comments/comments.schema";
//
// Forgetting to add the line silently produces empty migrations.

export * from "@/modules/posts/posts.schema";
export * from "@/modules/profiles/profiles.schema";
