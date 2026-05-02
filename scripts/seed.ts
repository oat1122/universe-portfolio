// Idempotent seed: creates an admin auth user + profile + a sample published post.
//
// Run with: `npm run db:seed`
// Env loading: package.json passes `--env-file=.env` to tsx, so process.env is
// populated before any module here is imported (including @/config/env).
//
// Required in .env:
//   DATABASE_URL                  — used by Drizzle (bypasses RLS via direct DB conn)
//   NEXT_PUBLIC_SUPABASE_URL      — used by Supabase Admin API
//   SUPABASE_SERVICE_ROLE_KEY     — used by Supabase Admin API
// Optional:
//   SEED_ADMIN_EMAIL              — defaults to "admin@demo.local"
//   SEED_ADMIN_PASSWORD           — defaults to "DevPassword123!"

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import { db } from "@/infrastructure/db/client";
import { posts } from "@/modules/posts/posts.schema";
import { profiles } from "@/modules/profiles/profiles.schema";

const SEED_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@demo.local";
const SEED_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "DevPassword123!";
const SEED_USERNAME = "demo";

async function findOrCreateAuthUser(): Promise<string> {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to seed");
  }

  const admin = createAdminClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
    email_confirm: true,
  });

  if (created?.user) return created.user.id;

  // Treat "user already exists" as success and look up the id.
  const isAlreadyExists =
    createErr?.code === "email_exists" ||
    (createErr?.message ?? "").toLowerCase().includes("already");
  if (!isAlreadyExists) {
    throw new Error(`Failed to create auth user: ${createErr?.message ?? "unknown"}`);
  }

  // Admin API has no getByEmail — page through users.
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const found = data.users.find((u) => u.email === SEED_EMAIL);
    if (found) return found.id;
    if (data.users.length < 1000) break;
    page += 1;
  }
  throw new Error(`Could not find auth user with email=${SEED_EMAIL}`);
}

async function main() {
  console.info(`[seed] email=${SEED_EMAIL}`);

  const userId = await findOrCreateAuthUser();
  console.info(`[seed] auth user id=${userId}`);

  await db
    .insert(profiles)
    .values({
      id: userId,
      username: SEED_USERNAME,
      displayName: "Demo Author",
      bio: "Personal blog of the Universe Portfolio demo user.",
      role: "admin",
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        displayName: "Demo Author",
        role: "admin",
        updatedAt: new Date(),
      },
    });
  console.info(`[seed] profile upserted username=${SEED_USERNAME} role=admin`);

  await db
    .insert(posts)
    .values({
      title: "Hello, Universe",
      slug: "hello-universe",
      content:
        "This is the first post on the Universe Portfolio.\n\nPowered by Next.js 16, Drizzle ORM, and Supabase.",
      excerpt: "A first post to verify the full read pipeline.",
      published: true,
      publishedAt: new Date(),
      authorId: userId,
    })
    .onConflictDoNothing({ target: posts.slug });
  console.info(`[seed] sample post upserted slug=hello-universe`);

  console.info(`[seed] done. login at /login with email=${SEED_EMAIL}`);
  process.exit(0);
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[seed] failed: ${msg}`);
  process.exit(1);
});
