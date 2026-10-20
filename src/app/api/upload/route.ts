import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";

export const dynamic = "force-dynamic";

// Stored inside PostgreSQL (as a base64 data URL) so uploads survive on
// serverless platforms such as Neon/Vercel where the local filesystem is
// read-only and wiped on every deploy.
const MAX_BYTES = 12 * 1024 * 1024; // 12 MB — plenty for hero images + logo

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const headerKey = req.headers.get("x-admin-passkey");
    if (!(await isAdminRequest(req, headerKey ?? form.get("passkey")))) {
      return NextResponse.json({ success: false, error: "Unauthorized upload" }, { status: 401 });
    }

    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const ext = (file.name.slice(file.name.lastIndexOf(".")).toLowerCase() || "").replace(".jpeg", ".jpg");
    const mime = MIME_BY_EXT[ext] ?? file.type;
    if (!MIME_BY_EXT[ext]) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Use JPG, PNG, WEBP, SVG, GIF, MP4, WEBM or MOV." },
        { status: 415 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, error: "File is larger than 12 MB." }, { status: 413 });
    }

    const base64 = await arrayBufferToBase64(await file.arrayBuffer());
    const dataUrl = `data:${mime};base64,${base64}`;
    const kind = mime.startsWith("video/") ? "video" : "image";
    const base = file.name
      .slice(0, file.name.lastIndexOf("."))
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .slice(0, 60) || "upload";

    const [asset] = await db
      .insert(mediaAssets)
      .values({ filename: `${base}${ext}`, mime, kind, data: dataUrl })
      .returning();

    return NextResponse.json({
      success: true,
      url: `/api/media/${asset.id}`,
      type: kind,
      fileName: asset.filename,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload file." }, { status: 500 });
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
