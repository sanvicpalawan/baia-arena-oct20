// One-off: remove the rows created by the end-to-end wiring verification so the
// production branch starts clean. Run: node scripts/cleanup-verify.mjs
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });
config({ path: ".env" });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL });

const statements = [
  ["bookings", "delete from bookings where guest_email = 'verify@example.com'"],
  ["inquiries", "delete from inquiries where email = 'verify@example.com'"],
  ["chat_messages", "delete from chat_messages where session_id = 'verify-session-1'"],
  ["media_assets", "delete from media_assets where filename = 'neon-check.png'"],
];

for (const [label, sql] of statements) {
  const res = await pool.query(sql);
  console.log(`${label}: deleted ${res.rowCount}`);
}

await pool.end();
