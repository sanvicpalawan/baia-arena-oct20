import { NextResponse } from "next/server";
import { verifyPasskey } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 25;
const failures = new Map<string, { count: number; first: number }>();

function clientId(req: Request): string {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  const id = clientId(req);
  const now = Date.now();
  const existing = failures.get(id);
  if (existing && now - existing.first > WINDOW_MS) failures.delete(id);
  const entry = failures.get(id);
  if (entry && entry.count >= MAX_FAILURES) {
    return NextResponse.json({ success: false, error: "Too many attempts. Please wait 15 minutes and try again." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  if (await verifyPasskey(body?.passkey)) {
    failures.delete(id);
    return NextResponse.json({ success: true });
  }

  failures.set(id, { count: (entry?.count ?? 0) + 1, first: entry?.first ?? now });
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json({ success: false, error: "Incorrect passkey" }, { status: 401 });
}
