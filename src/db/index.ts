import { drizzle } from "drizzle-orm/node-postgres";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";

/**
 * Neon Postgres (pooled connection string) via node-postgres.
 *
 * `node-postgres` + the pooled `DATABASE_URL` is the driver Neon recommends for
 * Next.js on Vercel with Fluid compute: one long-lived pool per function
 * instance instead of a connection per request.
 * https://neon.com/docs/connect/choose-connection
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    // Neon's PgBouncer pool handles the real fan-in; keep each instance small so
    // many concurrent function instances can't exhaust the project's connections.
    max: 5,
  });

// Keeps the Vercel function instance alive long enough for idle connections to be
// released, instead of leaking them when an instance freezes. No-op off Vercel.
attachDatabasePool(pool);

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
