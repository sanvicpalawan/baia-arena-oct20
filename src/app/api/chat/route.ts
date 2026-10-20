import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { chatMessages } from "@/db/schema";
import { getSiteConfig } from "@/lib/getSiteConfig";
import type { SiteConfig } from "@/lib/siteConfig";
import { mapsDirectionsUrl } from "@/lib/maps";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ success: true, messages: [] });
  try {
    const messages = await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId)).orderBy(chatMessages.createdAt);
    return NextResponse.json({ success: true, messages });
  } catch {
    return NextResponse.json({ success: true, messages: [] });
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.slice(0, 64) : "";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 1000) : "";
  if (!sessionId || !message) {
    return NextResponse.json({ success: false, error: "Session and message required" }, { status: 400 });
  }

  const config = await getSiteConfig();
  const reply = generateReply(message, config);

  try {
    await db.insert(chatMessages).values([
      { sessionId, role: "user", content: message },
      { sessionId, role: "assistant", content: reply },
    ]);
  } catch (error) {
    console.error("Chat log error:", error);
  }

  return NextResponse.json({ success: true, reply: { role: "assistant", content: reply } });
}

const STOP = new Set(
  "the and for are you your with what how can does is to of in on at we our from there this that have has any about get be will would could should do it its as or if an a there here want need".split(" ")
);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w));
}

function generateReply(message: string, cfg: SiteConfig): string {
  const text = message.toLowerCase();
  const has = (...words: string[]) => words.some((w) => text.includes(w));
  const rooms = cfg.accommodations.rooms.filter((r) => r.active);
  const savings = cfg.otaLinks.savingsPercent;

  if (/^(hi|hello|hey|mabuhay|good (morning|afternoon|evening))\b/.test(text)) {
    return "Mabuhay and welcome to BAIA! I can help with our cottages and rates, the calm swimming waters, island hopping, dining, or getting here from San Vicente airport. What would you like to know?";
  }

  if (has("rate", "price", "cost", "how much", "cottage", "room", "suite", "villa", "available", "availability")) {
    const list = rooms.map((r) => `• ${r.name} — from $${r.pricePerNight}/night (${r.occupancy})`).join("\n");
    return `We have ${rooms.length} private cottages on the beach:\n${list}\n\nBooking direct on this website always gives you our best rate${savings ? ` — up to ${savings}% less than booking sites` : ""}. Tap "Book your stay" to check your dates.`;
  }

  if (has("direct", "airbnb", "booking.com", "agoda", "expedia", "discount", "cheaper", "perk", "benefit")) {
    const perks = cfg.otaLinks.perks.map((p) => `• ${p.text}`).join("\n");
    return `Booking directly with us includes:\n${perks}\n\nIt's the same cottage — just a better rate and a more personal stay.`;
  }

  const query = tokens(message);
  let best = { score: 0, answer: "" };
  for (const faq of cfg.faq.questions) {
    const set = new Set(tokens(`${faq.question} ${faq.category}`));
    const score = query.reduce((sum, w) => sum + (set.has(w) ? 1 : 0), 0);
    if (score > best.score) best = { score, answer: faq.answer };
  }
  if (best.score >= 2 || (best.score === 1 && query.length <= 2)) return best.answer;

  if (has("airport", "flight", "transfer", "pickup", "pick up", "arrive", "get there", "how to get")) {
    return `${cfg.location.airportNote} BAIA is in ${cfg.location.title}, about 10 minutes from San Vicente Airport (SWL).`;
  }
  if (has("where", "location", "address", "map", "direction")) {
    return `You'll find us at ${cfg.footer.address}. Directions: ${mapsDirectionsUrl(cfg.location.mapLat, cfg.location.mapLng)}`;
  }
  if (has("swim", "water", "beach", "ocean", "sea", "snorkel")) {
    return "Penanindigan Bay is sheltered by outer reefs, so the water is calm, clear and turquoise — and only a few steps from your cottage.";
  }
  if (has("boat", "island", "tour", "hopping", "turtle")) {
    return "Our private outrigger boats pick you up right on the sand in front of BAIA for island hopping, sandbars and sea-turtle snorkelling — no van transfers to busy ports.";
  }
  if (has("food", "dining", "breakfast", "dinner", "lunch", "eat", "menu", "vegan", "vegetarian", "gluten", "restaurant")) {
    const menus = cfg.dining.menus.map((m) => `• ${m.name} (${m.hours})`).join("\n");
    return `Our kitchen cooks Mediterranean, Italian and Palawan dishes with the day's catch:\n${menus}\n\nVegan, gluten-free and pescatarian requests are always welcome.`;
  }
  if (has("wifi", "wi-fi", "internet", "work", "starlink")) {
    return "We have high-speed Starlink Wi-Fi across the cottages and beach cabanas, with power backup — ideal for remote work.";
  }
  if (has("contact", "phone", "whatsapp", "email", "call")) {
    return `You can reach our hosts on ${cfg.footer.phone} or ${cfg.footer.email}. We usually reply within the hour.`;
  }

  return "I'm BAIA's digital concierge. Ask me about our cottages and rates, booking direct, the calm waters, island hopping, dining, Wi-Fi, or airport transfers — or tap \"Book your stay\" to check your dates.";
}
