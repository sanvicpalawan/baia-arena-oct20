import { NextResponse } from "next/server";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

function parseDataUrl(dataUrl: string): { mime: string; buffer: Buffer } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  if (!match) throw new Error("Invalid stored media");
  return { mime: match[1], buffer: Buffer.from(match[2], "base64") };
}

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const id = Number((segments ?? []).join("/"));
  if (!Number.isFinite(id)) return new Response("Not found", { status: 404 });

  try {
    const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id));
    if (!asset) return new Response("Not found", { status: 404 });

    const { mime, buffer } = parseDataUrl(asset.data);
    const blob = new Blob([buffer as unknown as BlobPart], { type: mime });
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": `inline; filename="${asset.filename}"`,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
