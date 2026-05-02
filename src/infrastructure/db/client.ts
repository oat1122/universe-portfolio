// Note: no `import "server-only"` here. postgres-js depends on `net`/`tls`/`fs`
// which already break the browser bundle, so the guard is redundant. Keeping it
// would also break Node CLI scripts (scripts/seed.ts) that legitimately need a
// DB connection without a React tree. The auth.service / supabase/server.ts
// guards still cover the routes where leakage would matter.
import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import { env } from "@/config/env";

// Reuse the same pg client across HMR reloads in dev so we don't exhaust Supabase pooler connections.
const globalForPg = globalThis as unknown as { __pgClient?: Sql };

const queryClient =
  globalForPg.__pgClient ??
  postgres(env.DATABASE_URL, {
    prepare: false, // Supabase pgBouncer transaction-mode pooler requires this
    ssl: "require",
  });

if (env.NODE_ENV !== "production") {
  globalForPg.__pgClient = queryClient;
}

export const db = drizzle(queryClient);
