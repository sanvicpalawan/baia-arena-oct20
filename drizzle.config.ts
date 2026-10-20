import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// `neon deploy` / `neon env pull` write to .env.local; plain `.env` is the fallback.
// Neither file overrides a value already present in the shell environment.
config({ path: ".env.local" });
config({ path: ".env" });

/**
 * Drizzle Kit (schema push / migrations) must use the DIRECT Neon connection:
 * PgBouncer in transaction mode does not support the session-level statements
 * DDL and introspection rely on.
 */
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED (preferred) or DATABASE_URL must be set");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
