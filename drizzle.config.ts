import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Use Next's loader so drizzle-kit reads the same files (.env, .env.local, .env.development.local, ...)
// in the same priority as `next dev` / `next build`.
loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for drizzle-kit");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infrastructure/db/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: process.env.DRIZZLE_VERBOSE === "true",
});
