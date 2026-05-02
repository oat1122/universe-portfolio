import "server-only";

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
