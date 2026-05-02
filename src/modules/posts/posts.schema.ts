import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "@/modules/profiles/profiles.schema";

// Cross-module schema import is permitted: schema files are inert data definitions,
// not service code. The "no cross-module internal imports" rule applies to service /
// repository layers — schemas need each other to declare foreign keys correctly.
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    coverImage: text("cover_image"),
    published: boolean("published").default(false).notNull(),
    views: integer("views").default(0).notNull(),
    // ON DELETE RESTRICT: a profile that still owns posts cannot be removed directly.
    // Account deletion still works because auth.users → profiles cascades, but the
    // app must reassign or delete posts before that chain reaches profiles.
    authorId: uuid("author_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Composite index supports the public list query: WHERE published = true ORDER BY published_at DESC.
    index("posts_published_published_at_idx").on(table.published, table.publishedAt),
    // Speeds up FK joins and "posts by author" lookups; Postgres does not auto-index FKs.
    index("posts_author_id_idx").on(table.authorId),
    // Public can read only published posts.
    pgPolicy("Anyone can read published posts", {
      for: "select",
      to: "public",
      using: sql`published = true`,
    }),
    // Authors see their own drafts in addition to the public read above.
    pgPolicy("Authors can read their own drafts", {
      for: "select",
      to: "authenticated",
      using: sql`(select auth.uid()) = author_id`,
    }),
    pgPolicy("Authors can insert their own posts", {
      for: "insert",
      to: "authenticated",
      withCheck: sql`(select auth.uid()) = author_id`,
    }),
    pgPolicy("Authors can update their own posts", {
      for: "update",
      to: "authenticated",
      using: sql`(select auth.uid()) = author_id`,
      withCheck: sql`(select auth.uid()) = author_id`,
    }),
    pgPolicy("Authors can delete their own posts", {
      for: "delete",
      to: "authenticated",
      using: sql`(select auth.uid()) = author_id`,
    }),
  ],
).enableRLS();

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(profiles, {
    fields: [posts.authorId],
    references: [profiles.id],
  }),
}));
