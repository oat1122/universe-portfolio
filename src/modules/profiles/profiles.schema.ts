import { sql } from "drizzle-orm";
import { index, pgPolicy, pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Reference handle to Supabase's managed `auth.users` table.
// We do NOT own this table — it's declared here only so Drizzle can type-check
// the foreign key. drizzle-kit will skip emitting CREATE for it because it lives
// in the `auth` schema, not `public`.
const authSchema = pgSchema("auth");
const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const profiles = pgTable(
  "profiles",
  {
    // Profile id mirrors auth.users.id 1-to-1 (same UUID, set explicitly on insert).
    // ON DELETE CASCADE: deleting the auth user removes their profile automatically.
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    username: text("username").notNull().unique(),
    displayName: text("display_name").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("profiles_username_idx").on(table.username),
    // Profiles are public — shown on every blog post byline.
    pgPolicy("Anyone can read profiles", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    // A user may only insert a profile row whose id matches their own auth uid.
    pgPolicy("Users can insert their own profile", {
      for: "insert",
      to: "authenticated",
      withCheck: sql`(select auth.uid()) = id`,
    }),
    // A user may only update their own profile row.
    pgPolicy("Users can update their own profile", {
      for: "update",
      to: "authenticated",
      using: sql`(select auth.uid()) = id`,
      withCheck: sql`(select auth.uid()) = id`,
    }),
    // No DELETE policy on purpose: profile removal is driven by the
    // auth.users ON DELETE CASCADE chain, not by direct user action.
  ],
).enableRLS();
