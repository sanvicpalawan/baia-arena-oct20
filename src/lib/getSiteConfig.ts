import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { normalizeConfig } from "./siteConfig";
import type { SiteConfig } from "./siteConfig";

const CONFIG_KEY = "main_config";

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, CONFIG_KEY)).limit(1);
    return normalizeConfig(rows[0]?.data ?? null);
  } catch (error) {
    console.error("getSiteConfig: falling back to defaults", error);
    return normalizeConfig(null);
  }
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  await db
    .insert(siteSettings)
    .values({ key: CONFIG_KEY, data: config })
    .onConflictDoUpdate({ target: siteSettings.key, set: { data: config, updatedAt: new Date() } });
}
