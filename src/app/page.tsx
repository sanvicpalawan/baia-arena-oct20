import { SiteShell } from "@/components/SiteShell";
import { getSiteConfig } from "@/lib/getSiteConfig";

// Content is edited live from the admin, so render on every request.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const config = await getSiteConfig();
  return <SiteShell initialConfig={config} />;
}
