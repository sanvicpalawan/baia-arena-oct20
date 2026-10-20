export type MapView = "map" | "satellite";

export interface MapPoint {
  mapLat: number;
  mapLng: number;
  mapZoom?: number;
  googleMapsUrl?: string;
}

const r6 = (n: number) => Math.round(n * 1e6) / 1e6;

export function isValidLatLng(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

/** Google Maps embed (no API key required). "satellite" uses the hybrid view with labels. */
export function mapEmbedUrl(lat: number, lng: number, zoom: number, view: MapView): string {
  const t = view === "satellite" ? "h" : "m";
  const z = Math.min(20, Math.max(3, Math.round(zoom || 15)));
  return `https://maps.google.com/maps?q=${r6(lat)},${r6(lng)}&t=${t}&z=${z}&hl=en&output=embed`;
}

export function mapsOpenUrl(point: MapPoint): string {
  const custom = point.googleMapsUrl?.trim();
  if (custom) return custom;
  return `https://www.google.com/maps/search/?api=1&query=${r6(point.mapLat)},${r6(point.mapLng)}`;
}

export function mapsDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${r6(lat)},${r6(lng)}`;
}

export function formatCoords(lat: number, lng: number): string {
  if (!isValidLatLng(lat, lng)) return "";
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
}

/** Finds coordinates in a pasted Google Maps link or a "lat, lng" string. */
export function parseLatLng(input: string): { lat: number; lng: number; zoom?: number } | null {
  let text = input.trim();
  try {
    text = decodeURIComponent(text);
  } catch {
    /* keep the raw text */
  }
  const patterns: RegExp[] = [
    /!3d(-?\d{1,2}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)/,
    /@(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)(?:,(\d{1,2}(?:\.\d+)?)z)?/,
    /[?&](?:q|query|ll|sll|center|destination|daddr)=(?:loc:)?(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/,
    /^\s*(-?\d{1,2}\.\d+)\s*[,\s]\s*(-?\d{1,3}\.\d+)\s*$/,
  ];
  for (const re of patterns) {
    const m = re.exec(text);
    if (!m) continue;
    const lat = Number(m[1]);
    const lng = Number(m[2]);
    if (!isValidLatLng(lat, lng)) continue;
    const zoom = m[3] ? Number(m[3]) : undefined;
    return { lat, lng, zoom: zoom && Number.isFinite(zoom) ? zoom : undefined };
  }
  return null;
}
