import { NextResponse } from "next/server";
import { normalizePasskey, setPasskey, verifyPasskey } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const current = body?.current ?? req.headers.get("x-admin-passkey");
  if (!(await verifyPasskey(current))) {
    return NextResponse.json({ success: false, error: "Your current passkey is incorrect." }, { status: 401 });
  }
  const next = normalizePasskey(body?.next);
  if (next.length < 4 || next.length > 32) {
    return NextResponse.json({ success: false, error: "Please use between 4 and 32 characters." }, { status: 400 });
  }
  try {
    await setPasskey(next);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Passkey update failed:", error);
    return NextResponse.json({ success: false, error: "Could not save the new passkey." }, { status: 500 });
  }
}
