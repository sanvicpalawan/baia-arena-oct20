import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

/** Default passkey until the owner sets a new one in Admin → Security. */
export const DEFAULT_ADMIN_PASSKEY = "5309";
const PASSKEY_ROW = "admin_passkey";

interface StoredPasskey {
  hash: string;
  salt: string;
}

let cache: { value: StoredPasskey | null; at: number } | null = null;

/** Strips spaces and converts full-width digits/letters so mobile keyboards can't cause mismatches. */
export function normalizePasskey(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.normalize("NFKC").replace(/\s+/g, "");
}

function hashPasskey(passkey: string, salt: string): string {
  return scryptSync(passkey, salt, 32).toString("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

async function readStored(): Promise<StoredPasskey | null> {
  if (cache && Date.now() - cache.at < 15_000) return cache.value;
  try {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, PASSKEY_ROW)).limit(1);
    const data = rows[0]?.data as Partial<StoredPasskey> | undefined;
    const value = data && typeof data.hash === "string" && typeof data.salt === "string" ? { hash: data.hash, salt: data.salt } : null;
    cache = { value, at: Date.now() };
    return value;
  } catch (error) {
    console.error("adminAuth: could not read stored passkey", error);
    return null;
  }
}

export async function verifyPasskey(input: unknown): Promise<boolean> {
  const candidate = normalizePasskey(input);
  if (!candidate || candidate.length > 64) return false;

  // Optional recovery key set by the developer in .env (ADMIN_PASSKEY=...)
  const recovery = normalizePasskey(process.env.ADMIN_PASSKEY);
  if (recovery && safeEqual(candidate, recovery)) return true;

  const stored = await readStored();
  if (stored) return safeEqual(hashPasskey(candidate, stored.salt), stored.hash);
  return safeEqual(candidate, DEFAULT_ADMIN_PASSKEY);
}

export async function setPasskey(next: string): Promise<void> {
  const salt = randomBytes(16).toString("hex");
  const data = { hash: hashPasskey(next, salt), salt, updatedAt: new Date().toISOString() };
  await db
    .insert(siteSettings)
    .values({ key: PASSKEY_ROW, data })
    .onConflictDoUpdate({ target: siteSettings.key, set: { data, updatedAt: new Date() } });
  cache = { value: { hash: data.hash, salt }, at: Date.now() };
}

export async function isAdminRequest(req: Request, fallbackKey?: unknown): Promise<boolean> {
  const header = req.headers.get("x-admin-passkey");
  return verifyPasskey(header ?? fallbackKey);
}
