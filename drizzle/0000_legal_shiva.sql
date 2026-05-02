CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"cover_image" text,
	"published" boolean DEFAULT false NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"author_id" uuid NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_published_published_at_idx" ON "posts" USING btree ("published","published_at");--> statement-breakpoint
CREATE INDEX "posts_author_id_idx" ON "posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "profiles_username_idx" ON "profiles" USING btree ("username");--> statement-breakpoint
CREATE POLICY "Anyone can read published posts" ON "posts" AS PERMISSIVE FOR SELECT TO public USING (published = true);--> statement-breakpoint
CREATE POLICY "Authors can read their own drafts" ON "posts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "Authors can insert their own posts" ON "posts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "Authors can update their own posts" ON "posts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = author_id) WITH CHECK ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "Authors can delete their own posts" ON "posts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "Anyone can read profiles" ON "profiles" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Users can insert their own profile" ON "profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = id);--> statement-breakpoint
CREATE POLICY "Users can update their own profile" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);