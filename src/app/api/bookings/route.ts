import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { isAdminRequest } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// Admin only — guest details are private
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (!(await isAdminRequest(req, searchParams.get("passkey")))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const list = await db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(200);
    return NextResponse.json({ success: true, bookings: list });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json({ success: false, bookings: [], error: "Database unavailable" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { guestName, guestEmail, guestPhone, roomType, checkIn, checkOut, guestsCount, specialRequests, totalPrice, airportTransfer, notes } = body ?? {};

    if (!guestName || !guestEmail || !roomType || !checkIn || !checkOut) {
      return NextResponse.json({ success: false, error: "Missing required booking details." }, { status: 400 });
    }
    if (String(checkOut) <= String(checkIn)) {
      return NextResponse.json({ success: false, error: "Check-out must be after check-in." }, { status: 400 });
    }

    const inserted = await db
      .insert(bookings)
      .values({
        guestName: String(guestName).slice(0, 120),
        guestEmail: String(guestEmail).slice(0, 160),
        guestPhone: guestPhone ? String(guestPhone).slice(0, 60) : "",
        roomType: String(roomType).slice(0, 120),
        checkIn: String(checkIn),
        checkOut: String(checkOut),
        guestsCount: Number(guestsCount) || 2,
        specialRequests: specialRequests ? String(specialRequests).slice(0, 2000) : "",
        totalPrice: Number(totalPrice) || 0,
        airportTransfer: airportTransfer ?? true,
        status: "confirmed",
        notes: notes ? String(notes).slice(0, 2000) : "Direct website booking",
      })
      .returning();

    return NextResponse.json({ success: true, booking: inserted[0] });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ success: false, error: "We could not save your reservation. Please try again or WhatsApp us." }, { status: 500 });
  }
}

// Booking agent updates (status, notes, room, price)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!(await isAdminRequest(req, body?.passkey))) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id, status, notes, roomType, totalPrice } = body ?? {};
    if (!id) return NextResponse.json({ success: false, error: "Booking ID required" }, { status: 400 });

    const updateData: Partial<typeof bookings.$inferInsert> = {};
    if (typeof status === "string") updateData.status = status;
    if (typeof notes === "string") updateData.notes = notes;
    if (typeof roomType === "string") updateData.roomType = roomType;
    if (totalPrice !== undefined) updateData.totalPrice = Number(totalPrice) || 0;

    const updated = await db.update(bookings).set(updateData).where(eq(bookings.id, Number(id))).returning();
    return NextResponse.json({ success: true, booking: updated[0] });
  } catch (error) {
    console.error("Patch booking error:", error);
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 });
  }
}
