// Curated professional font library (Google Fonts) for the BAIA admin.
// `spec` is the css2 axis spec appended after "family=Name:" ("" = regular only).

export interface FontOption {
  family: string;
  category: string;
  kind: "serif" | "sans";
  spec: string;
  note: string;
}

export const FONT_CATEGORIES = [
  "Garamond & Old-Style",
  "Didone & High-Contrast",
  "Roman & Inscriptional",
  "Contemporary Serif",
  "Geometric Sans",
  "Humanist Sans",
  "Neo-Grotesk",
] as const;

const SERIF_FULL = "ital,wght@0,300;0,400;0,500;0,600;1,300;1,400";
const SANS_FULL = "wght@300;400;500;600;700";

export const FONT_LIBRARY: FontOption[] = [
  // Garamond & Old-Style
  { family: "Cormorant Garamond", category: "Garamond & Old-Style", kind: "serif", spec: "ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500", note: "Mediterranean classic · BAIA default" },
  { family: "Cormorant", category: "Garamond & Old-Style", kind: "serif", spec: SERIF_FULL, note: "Display Garamond, sculpted" },
  { family: "EB Garamond", category: "Garamond & Old-Style", kind: "serif", spec: "ital,wght@0,400;0,500;0,600;1,400;1,500", note: "Renaissance book face" },
  { family: "Libre Caslon Display", category: "Garamond & Old-Style", kind: "serif", spec: "", note: "Refined Caslon headlines" },
  { family: "Crimson Pro", category: "Garamond & Old-Style", kind: "serif", spec: SERIF_FULL, note: "Literary, warm" },
  { family: "Spectral", category: "Garamond & Old-Style", kind: "serif", spec: SERIF_FULL, note: "Elegant screen-first serif" },
  // Didone & High-Contrast
  { family: "Playfair Display", category: "Didone & High-Contrast", kind: "serif", spec: "ital,wght@0,400;0,500;0,600;0,700;1,400;1,500", note: "Editorial, dramatic" },
  { family: "Bodoni Moda", category: "Didone & High-Contrast", kind: "serif", spec: "ital,wght@0,400;0,500;0,600;1,400;1,500", note: "Couture Didone" },
  { family: "DM Serif Display", category: "Didone & High-Contrast", kind: "serif", spec: "ital@0;1", note: "Bold fashion headlines" },
  { family: "Gilda Display", category: "Didone & High-Contrast", kind: "serif", spec: "", note: "Soft Didone, boutique" },
  { family: "Prata", category: "Didone & High-Contrast", kind: "serif", spec: "", note: "Jewel-like contrast" },
  { family: "Noto Serif Display", category: "Didone & High-Contrast", kind: "serif", spec: SERIF_FULL, note: "Crisp luxury display" },
  { family: "Instrument Serif", category: "Didone & High-Contrast", kind: "serif", spec: "ital@0;1", note: "Condensed, modern editorial" },
  // Roman & Inscriptional
  { family: "Marcellus", category: "Roman & Inscriptional", kind: "serif", spec: "", note: "Flared Roman · echoes the BAIA wordmark" },
  { family: "Cinzel", category: "Roman & Inscriptional", kind: "serif", spec: "wght@400;500;600;700", note: "Regal capitals" },
  { family: "Forum", category: "Roman & Inscriptional", kind: "serif", spec: "", note: "Antique, monumental" },
  { family: "Italiana", category: "Roman & Inscriptional", kind: "serif", spec: "", note: "Hairline Italian elegance" },
  { family: "Bellefair", category: "Roman & Inscriptional", kind: "serif", spec: "", note: "Airy, high-end hospitality" },
  { family: "Tenor Sans", category: "Roman & Inscriptional", kind: "sans", spec: "", note: "Quiet luxury sans" },
  // Contemporary Serif
  { family: "Lora", category: "Contemporary Serif", kind: "serif", spec: "ital,wght@0,400;0,500;0,600;1,400;1,500", note: "Calligraphic, friendly" },
  { family: "Libre Baskerville", category: "Contemporary Serif", kind: "serif", spec: "ital,wght@0,400;0,700;1,400", note: "Timeless Baskerville" },
  { family: "Fraunces", category: "Contemporary Serif", kind: "serif", spec: SERIF_FULL, note: "Organic, soft & crafted" },
  { family: "Newsreader", category: "Contemporary Serif", kind: "serif", spec: SERIF_FULL, note: "Reflective, bookish" },
  { family: "Young Serif", category: "Contemporary Serif", kind: "serif", spec: "", note: "Heritage character" },
  // Geometric Sans
  { family: "Plus Jakarta Sans", category: "Geometric Sans", kind: "sans", spec: SANS_FULL, note: "Modern geometric · BAIA default" },
  { family: "Jost", category: "Geometric Sans", kind: "sans", spec: SANS_FULL, note: "Futura-inspired luxury" },
  { family: "Outfit", category: "Geometric Sans", kind: "sans", spec: SANS_FULL, note: "Clean, airy" },
  { family: "Urbanist", category: "Geometric Sans", kind: "sans", spec: SANS_FULL, note: "Minimal, architectural" },
  { family: "Montserrat", category: "Geometric Sans", kind: "sans", spec: SANS_FULL, note: "Confident, versatile" },
  { family: "Josefin Sans", category: "Geometric Sans", kind: "sans", spec: SANS_FULL, note: "Vintage-elegant geometry" },
  { family: "Poppins", category: "Geometric Sans", kind: "sans", spec: SANS_FULL, note: "Rounded geometric" },
  { family: "Sora", category: "Geometric Sans", kind: "sans", spec: SANS_FULL, note: "Tech-refined" },
  { family: "Red Hat Display", category: "Geometric Sans", kind: "sans", spec: SANS_FULL, note: "Crisp display sans" },
  { family: "Albert Sans", category: "Geometric Sans", kind: "sans", spec: SANS_FULL, note: "Scandinavian clarity" },
  { family: "Lexend", category: "Geometric Sans", kind: "sans", spec: SANS_FULL, note: "Highly readable" },
  { family: "Questrial", category: "Geometric Sans", kind: "sans", spec: "", note: "Simple, gentle" },
  // Humanist Sans
  { family: "Manrope", category: "Humanist Sans", kind: "sans", spec: SANS_FULL, note: "Warm modern humanist" },
  { family: "Figtree", category: "Humanist Sans", kind: "sans", spec: SANS_FULL, note: "Friendly, precise" },
  { family: "Karla", category: "Humanist Sans", kind: "sans", spec: SANS_FULL, note: "Quirky-minimal" },
  { family: "Nunito Sans", category: "Humanist Sans", kind: "sans", spec: SANS_FULL, note: "Soft and calm" },
  { family: "Mulish", category: "Humanist Sans", kind: "sans", spec: SANS_FULL, note: "Minimalist humanist" },
  { family: "Lato", category: "Humanist Sans", kind: "sans", spec: "wght@300;400;700", note: "Classic hospitality body" },
  { family: "Source Sans 3", category: "Humanist Sans", kind: "sans", spec: SANS_FULL, note: "Highly legible" },
  { family: "Open Sans", category: "Humanist Sans", kind: "sans", spec: SANS_FULL, note: "Neutral workhorse" },
  { family: "Raleway", category: "Humanist Sans", kind: "sans", spec: SANS_FULL, note: "Elegant thin weights" },
  // Neo-Grotesk
  { family: "Inter", category: "Neo-Grotesk", kind: "sans", spec: SANS_FULL, note: "Ultra clean UI sans" },
  { family: "DM Sans", category: "Neo-Grotesk", kind: "sans", spec: SANS_FULL, note: "Low-contrast, modern" },
  { family: "Work Sans", category: "Neo-Grotesk", kind: "sans", spec: SANS_FULL, note: "Grotesque, balanced" },
  { family: "Hanken Grotesk", category: "Neo-Grotesk", kind: "sans", spec: SANS_FULL, note: "Swiss-refined" },
  { family: "IBM Plex Sans", category: "Neo-Grotesk", kind: "sans", spec: SANS_FULL, note: "Engineered, precise" },
];

export const DEFAULT_HEADING_FONT = "Cormorant Garamond";
export const DEFAULT_BODY_FONT = "Plus Jakarta Sans";

export interface FontPairing {
  id: string;
  name: string;
  heading: string;
  body: string;
  mood: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  { id: "riviera", name: "Riviera Classic", heading: "Cormorant Garamond", body: "Plus Jakarta Sans", mood: "Mediterranean · timeless (original)" },
  { id: "inscription", name: "Island Inscription", heading: "Marcellus", body: "Jost", mood: "Monumental calm · matches the logo" },
  { id: "editorial", name: "Editorial Coast", heading: "Playfair Display", body: "Inter", mood: "Magazine · confident" },
  { id: "organic", name: "Organic Modern", heading: "Fraunces", body: "Manrope", mood: "Warm · handcrafted" },
  { id: "heritage", name: "Heritage Villa", heading: "EB Garamond", body: "Montserrat", mood: "Old-world · refined" },
  { id: "airy", name: "Coastal Airy", heading: "Italiana", body: "Outfit", mood: "Light · breezy" },
  { id: "couture", name: "Couture Didone", heading: "Bodoni Moda", body: "DM Sans", mood: "Fashion · high contrast" },
  { id: "zen", name: "Zen Minimal", heading: "Tenor Sans", body: "Karla", mood: "Quiet · minimal" },
  { id: "literary", name: "Literary Retreat", heading: "Newsreader", body: "Figtree", mood: "Reflective · bookish" },
  { id: "royal", name: "Royal Palm", heading: "Cinzel", body: "Raleway", mood: "Regal · classical" },
];

export function findFont(family: string | undefined | null): FontOption | undefined {
  if (!family) return undefined;
  return FONT_LIBRARY.find((f) => f.family === family);
}

export function fontStack(family: string): string {
  const f = findFont(family);
  const fallback = f?.kind === "sans"
    ? 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    : 'Georgia, "Times New Roman", serif';
  return `"${family}", ${fallback}`;
}

const enc = (family: string) => family.trim().replace(/ /g, "+");

/** Full-weight stylesheet for the given families (skips defaults that next/font already self-hosts). */
export function googleFontsHref(families: string[], includeDefaults = false): string | null {
  const unique = Array.from(new Set(families)).filter((fam) => {
    if (!findFont(fam)) return false;
    if (!includeDefaults && (fam === DEFAULT_HEADING_FONT || fam === DEFAULT_BODY_FONT)) return false;
    return true;
  });
  if (unique.length === 0) return null;
  const params = unique
    .map((fam) => {
      const f = findFont(fam)!;
      return `family=${enc(f.family)}${f.spec ? `:${f.spec}` : ""}`;
    })
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

/** Lightweight subset stylesheet used only for admin previews (Google `text=` subsetting). */
export function googleFontsPreviewHref(families: string[], text: string): string {
  const params = families.map((fam) => `family=${enc(fam)}`).join("&");
  const chars = Array.from(new Set((text + families.join("")).split(""))).join("");
  return `https://fonts.googleapis.com/css2?${params}&text=${encodeURIComponent(chars)}&display=swap`;
}
