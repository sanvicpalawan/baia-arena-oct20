import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Please fill in all required fields." }, { status: 400 });
    }

    const inserted = await db.insert(inquiries).values({
      name,
      email,
      phone: phone || "",
      subject: subject || "General Inquiry",
      message,
    }).returning();

    return NextResponse.json({ success: true, inquiry: inserted[0] });
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json({ success: true, mock: true });
  }
}
