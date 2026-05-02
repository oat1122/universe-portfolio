CREATE TYPE "public"."profile_role" AS ENUM('admin', 'user');--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "role" "profile_role" DEFAULT 'user' NOT NULL;