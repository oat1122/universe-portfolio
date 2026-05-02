-- Move posts.content from plain text to Tiptap JSON.
-- Existing rows are wiped (per scope decision); db:seed re-creates the sample.
DELETE FROM "posts";--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "content" SET DATA TYPE jsonb USING content::jsonb;
