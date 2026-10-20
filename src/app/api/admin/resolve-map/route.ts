import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const ALLOWED_HOST = /(^|\.)(goo\.gl|g\.co|google\.[a-z]{2,3}(\.[a-z]{2})?)$/i;

/** Follows short Google Maps links (maps.app.goo.gl/…) so the admin can read the coordinates. */
export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ success: false, error: "Please sign in again." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  let current = typeof body?.url === "string" ? body.url.trim() : "";
  try {
    for (let hop = 0; hop < 6; hop++) {
      const url = new URL(current);
      if (!/^https?:$/.test(url.protocol) || !ALLOWED_HOST.test(url.hostname)) {
        return NextResponse.json({ success: false, error: "Please paste a Google Maps link." }, { status: 400 });
      }
      const res = await fetch(url, {
        redirect: "manual",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; BAIA-admin)" },
        signal: AbortSignal.timeout(7000),
      });
      const next = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && next) {
        current = new URL(next, url).toString();
        continue;
      }
      break;
    }
    return NextResponse.json({ success: true, url: current });
  } catch {
    return NextResponse.json({ success: false, error: "Couldn't open that link — paste the full Google Maps address or the coordinates instead." }, { status: 400 });
  }
}
