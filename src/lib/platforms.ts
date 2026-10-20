// Platform registries for social profiles and booking channels (OTAs).
// Brand glyph paths live in simpleIconPaths.ts (Simple Icons, CC0).
// Agoda + LinkedIn are not in Simple Icons, so evocative marks are drawn here.

export type SocialPlatform =
  | "instagram" | "facebook" | "tiktok" | "youtube" | "whatsapp" | "x" | "threads" | "pinterest"
  | "linkedin" | "telegram" | "viber" | "messenger" | "tripadvisor" | "googlemaps" | "spotify"
  | "vimeo" | "snapchat" | "line" | "wechat" | "email" | "website";

export interface SocialPlatformInfo {
  id: SocialPlatform;
  label: string;
  glyph: string;
  placeholder: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformInfo[] = [
  { id: "instagram", label: "Instagram", glyph: "instagram", placeholder: "https://instagram.com/yourhandle" },
  { id: "facebook", label: "Facebook", glyph: "facebook", placeholder: "https://facebook.com/yourpage" },
  { id: "tiktok", label: "TikTok", glyph: "tiktok", placeholder: "https://tiktok.com/@yourhandle" },
  { id: "youtube", label: "YouTube", glyph: "youtube", placeholder: "https://youtube.com/@yourchannel" },
  { id: "whatsapp", label: "WhatsApp", glyph: "whatsapp", placeholder: "https://wa.me/639171234567" },
  { id: "x", label: "X (Twitter)", glyph: "x", placeholder: "https://x.com/yourhandle" },
  { id: "threads", label: "Threads", glyph: "threads", placeholder: "https://threads.net/@yourhandle" },
  { id: "pinterest", label: "Pinterest", glyph: "pinterest", placeholder: "https://pinterest.com/yourprofile" },
  { id: "linkedin", label: "LinkedIn", glyph: "linkedin", placeholder: "https://linkedin.com/company/yourcompany" },
  { id: "telegram", label: "Telegram", glyph: "telegram", placeholder: "https://t.me/yourhandle" },
  { id: "viber", label: "Viber", glyph: "viber", placeholder: "viber://chat?number=%2B639171234567" },
  { id: "messenger", label: "Messenger", glyph: "messenger", placeholder: "https://m.me/yourpage" },
  { id: "tripadvisor", label: "Tripadvisor", glyph: "tripadvisor", placeholder: "https://tripadvisor.com/Hotel_Review-..." },
  { id: "googlemaps", label: "Google Maps", glyph: "googlemaps", placeholder: "https://maps.app.goo.gl/..." },
  { id: "spotify", label: "Spotify Playlist", glyph: "spotify", placeholder: "https://open.spotify.com/playlist/..." },
  { id: "vimeo", label: "Vimeo", glyph: "vimeo", placeholder: "https://vimeo.com/yourchannel" },
  { id: "snapchat", label: "Snapchat", glyph: "snapchat", placeholder: "https://snapchat.com/add/yourhandle" },
  { id: "line", label: "LINE", glyph: "line", placeholder: "https://line.me/R/ti/p/@yourid" },
  { id: "wechat", label: "WeChat", glyph: "wechat", placeholder: "weixin://dl/chat?yourid" },
  { id: "email", label: "Email", glyph: "email", placeholder: "mailto:reservations@baia-palawan.com" },
  { id: "website", label: "Website / Blog", glyph: "website", placeholder: "https://..." },
];

export function socialInfo(id: string): SocialPlatformInfo {
  return SOCIAL_PLATFORMS.find((p) => p.id === id) ?? SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];
}

export type OtaPlatform = "booking" | "airbnb" | "agoda" | "expedia" | "tripadvisor" | "tripcom" | "hotelscom" | "google";

export interface OtaPlatformInfo {
  id: OtaPlatform;
  label: string;
  glyph: string;
  tile: string; // tile background
  ink: string; // glyph colour on tile
  scale: "10" | "5";
  defaultRatingLabel: string;
  placeholder: string;
}

export const OTA_PLATFORMS: OtaPlatformInfo[] = [
  { id: "booking", label: "Booking.com", glyph: "bookingdotcom", tile: "#003B95", ink: "#FFFFFF", scale: "10", defaultRatingLabel: "Wonderful", placeholder: "https://www.booking.com/hotel/ph/..." },
  { id: "airbnb", label: "Airbnb", glyph: "airbnb", tile: "#FFF0F3", ink: "#FF385C", scale: "5", defaultRatingLabel: "Guest favourite", placeholder: "https://www.airbnb.com/rooms/..." },
  { id: "agoda", label: "Agoda", glyph: "agoda", tile: "#FFFFFF", ink: "#1F2024", scale: "10", defaultRatingLabel: "Exceptional", placeholder: "https://www.agoda.com/..." },
  { id: "expedia", label: "Expedia", glyph: "expedia", tile: "#191E3B", ink: "#FDDB32", scale: "10", defaultRatingLabel: "Exceptional", placeholder: "https://www.expedia.com/..." },
  { id: "tripadvisor", label: "Tripadvisor", glyph: "tripadvisor", tile: "#34E0A1", ink: "#000000", scale: "5", defaultRatingLabel: "Travellers' Choice", placeholder: "https://www.tripadvisor.com/Hotel_Review-..." },
  { id: "tripcom", label: "Trip.com", glyph: "tripdotcom", tile: "#287DFA", ink: "#FFFFFF", scale: "5", defaultRatingLabel: "Outstanding", placeholder: "https://www.trip.com/hotels/..." },
  { id: "hotelscom", label: "Hotels.com", glyph: "hotelsdotcom", tile: "#FFEFF1", ink: "#D32F45", scale: "10", defaultRatingLabel: "Exceptional", placeholder: "https://www.hotels.com/..." },
  { id: "google", label: "Google Reviews", glyph: "google", tile: "#EEF3FE", ink: "#4285F4", scale: "5", defaultRatingLabel: "Google rating", placeholder: "https://g.page/r/..." },
];

export function otaInfo(id: string): OtaPlatformInfo {
  return OTA_PLATFORMS.find((p) => p.id === id) ?? OTA_PLATFORMS[0];
}

export function guessOtaPlatform(name: string): OtaPlatform {
  const n = (name || "").toLowerCase();
  if (n.includes("airbnb")) return "airbnb";
  if (n.includes("agoda")) return "agoda";
  if (n.includes("expedia")) return "expedia";
  if (n.includes("tripadvisor")) return "tripadvisor";
  if (n.includes("trip.com") || n.includes("tripcom")) return "tripcom";
  if (n.includes("hotels")) return "hotelscom";
  if (n.includes("google")) return "google";
  return "booking";
}

/* Custom marks (24×24). `mono` uses currentColor; `colored` uses brand hues. */
const AGODA_A =
  "M10.2 4.6c-3 0-5.3 2.3-5.3 5.2s2.3 5.2 5.3 5.2c1.4 0 2.6-.5 3.5-1.4v1.1h2.5V4.9h-2.5V6c-.9-.9-2.1-1.4-3.5-1.4Zm.3 2.4c1.7 0 3 1.2 3 2.8s-1.3 2.8-3 2.8-3-1.2-3-2.8 1.3-2.8 3-2.8Z";
const AGODA_DOTS = [3.6, 7.8, 12, 16.2, 20.4];
const AGODA_COLORS = ["#EE3A43", "#F8A01B", "#FFCF1F", "#7DC142", "#3E8FD8"];

export const CUSTOM_GLYPHS: Record<string, { title: string; mono: string; colored: string }> = {
  agoda: {
    title: "Agoda",
    mono:
      `<path fill="currentColor" fill-rule="evenodd" d="${AGODA_A}"/>` +
      AGODA_DOTS.map((cx) => `<circle cx="${cx}" cy="19.6" r="1.55" fill="currentColor"/>`).join(""),
    colored:
      `<path fill="#1F2024" fill-rule="evenodd" d="${AGODA_A}"/>` +
      AGODA_DOTS.map((cx, i) => `<circle cx="${cx}" cy="19.6" r="1.55" fill="${AGODA_COLORS[i]}"/>`).join(""),
  },
  linkedin: {
    title: "LinkedIn",
    mono:
      '<path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/>',
    colored:
      '<path fill="#0A66C2" d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/>',
  },
};
