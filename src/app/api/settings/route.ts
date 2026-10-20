import { NextResponse } from "next/server";
import { getSiteConfig, saveSiteConfig } from "@/lib/getSiteConfig";
import { normalizeConfig } from "@/lib/siteConfig";
import { isAdminRequest } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getSiteConfig();
  return NextResponse.json({ success: true, config });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!(await isAdminRequest(req, body?.passkey))) {
    return NextResponse.json({ success: false, error: "Invalid passkey. Access denied." }, { status: 401 });
  }
  try {
    const config = normalizeConfig(body?.config);
    await saveSiteConfig(config);
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Failed to update site config:", error);
    return NextResponse.json({ success: false, error: "Database error while saving." }, { status: 500 });
  }
}
