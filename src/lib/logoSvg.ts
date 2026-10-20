// BAIA Palawan — vector recreation of the brand logo (transparent background).
// Pure string builder (no React / DOM) so it can be used inline, exported as a
// file, rendered on the server, or rasterised for favicons.

export type LogoLayout = "stacked" | "horizontal" | "wordmark" | "mark";
export type LogoTone = "dark" | "light";

export interface LogoSvgOptions {
  layout?: LogoLayout;
  tone?: LogoTone;
  ink?: string; // wordmark colour (dark tone)
  gold?: string; // spiral + horizon colour
  uid?: string; // unique id suffix for gradients / filters
  textured?: boolean; // subtle hand-printed grain
  animate?: boolean; // spiral draws itself on load
  turns?: number;
  spiralStroke?: number;
  width?: number; // optional intrinsic width (for standalone files)
}

export const LOGO_DEFAULT_INK = "#3E5374";
export const LOGO_DEFAULT_GOLD = "#B3A176";

type Pt = [number, number];

const CX = 975;
const CY = 463;
const r1 = (n: number) => Math.round(n * 10) / 10;

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

/** amount > 0 lightens toward white, amount < 0 darkens toward black */
export function shadeHex(hex: string, amount: number): string {
  if (!isHexColor(hex)) return hex;
  let h = hex.trim().slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const num = parseInt(h, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  if (amount >= 0) {
    r += (255 - r) * amount;
    g += (255 - g) * amount;
    b += (255 - b) * amount;
  } else {
    r *= 1 + amount;
    g *= 1 + amount;
    b *= 1 + amount;
  }
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/* ------------------------------------------------------------------ */
/* Spiral (hand-drawn Archimedean spiral, drawn from the centre out)   */
/* ------------------------------------------------------------------ */
function spiralPoint(p: number, turns: number, rOuter: number, rInner: number): Pt {
  const t = 0.45 - p * turns * Math.PI * 2;
  const wobble =
    (2.2 * Math.sin(Math.PI * 2 * p * 9.3) + 1.3 * Math.sin(Math.PI * 2 * p * 23.7 + 1.1)) * (1 - 0.55 * p);
  const r = rOuter - (rOuter - rInner) * p + wobble;
  return [CX + r * Math.cos(t), CY + r * Math.sin(t) * 0.965];
}

export function buildSpiralPath(turns = 7, rOuter = 234, rInner = 36): string {
  const segs = Math.max(12, Math.round(turns * 10));
  const P = (p: number) => spiralPoint(p, turns, rOuter, rInner);
  const D = (p: number): Pt => {
    const h = 1e-4;
    const a = Math.max(0, p - h);
    const b = Math.min(1, p + h);
    const pa = P(a);
    const pb = P(b);
    return [(pb[0] - pa[0]) / (b - a), (pb[1] - pa[1]) / (b - a)];
  };
  const s = P(1);
  let d = `M${r1(s[0])} ${r1(s[1])}`;
  for (let i = segs; i > 0; i--) {
    const pb = i / segs;
    const pa = (i - 1) / segs;
    const dl = pb - pa;
    const B = P(pb);
    const A = P(pa);
    const dB = D(pb);
    const dA = D(pa);
    const c1: Pt = [B[0] - (dB[0] * dl) / 3, B[1] - (dB[1] * dl) / 3];
    const c2: Pt = [A[0] + (dA[0] * dl) / 3, A[1] + (dA[1] * dl) / 3];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(A[0])} ${r1(A[1])}`;
  }
  return d;
}

/* ------------------------------------------------------------------ */
/* Horizon line (tapered brush stroke)                                 */
/* ------------------------------------------------------------------ */
const WAVE_POINTS: Pt[] = [
  [215, 1397], [330, 1378], [450, 1357], [560, 1350], [680, 1360], [790, 1380], [880, 1389],
  [985, 1376], [1085, 1356], [1185, 1342], [1268, 1345], [1300, 1350], [1318, 1361],
  [1420, 1373], [1560, 1388], [1690, 1398],
];

function catmullRom(points: Pt[], samples: number): Pt[] {
  const out: Pt[] = [];
  const n = points.length;
  for (let s = 0; s <= samples; s++) {
    const u = (s / samples) * (n - 1);
    const i = Math.min(n - 2, Math.floor(u));
    const t = u - i;
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];
    const t2 = t * t;
    const t3 = t2 * t;
    const f = (a: number, b: number, c: number, d: number) =>
      0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
    out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
  }
  return out;
}

export function buildHorizonPath(): string {
  const pts = catmullRom(WAVE_POINTS, 96);
  const sideA: Pt[] = [];
  const sideB: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const u = i / (pts.length - 1);
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = ((1.6 + 10.5 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.9)), 0.85)) * (0.92 + 0.08 * Math.sin(u * 40))) / 2;
    sideA.push([pts[i][0] + nx * w, pts[i][1] + ny * w]);
    sideB.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }
  const all = [...sideA, ...sideB.reverse()];
  return "M" + all.map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L") + "Z";
}

/* ------------------------------------------------------------------ */
/* Wordmark — B · A · I · A (A's with the cut left leg)                */
/* ------------------------------------------------------------------ */
const B_PATH =
  "M398 866H472C520 866 548 892 548 926C548 962 532 980 510 990C545 1000 572 1020 572 1052C572 1090 542 1110 485 1110H398Q404 985 398 866Z" +
  "M448 890H480C500 890 512 904 512 926C512 950 500 968 476 968H448Z" +
  "M448 992H488C512 992 528 1010 528 1038C528 1062 512 1076 484 1076H448Z";

function aGlyph(dx: number): string {
  const x = (v: number) => v + dx;
  return (
    `M${x(826)} 866H${x(856)}L${x(936)} 1100H${x(860)}Z` +
    `M${x(826)} 866L${x(838)} 880L${x(814)} 1000H${x(800)}Z` +
    `M${x(796)} 1000H${x(874)}L${x(882)} 1030H${x(780)}Z`
  );
}

const I_PATH = "M1092 866H1148Q1140 983 1148 1100H1092Q1100 983 1092 866Z";
const WORD_PATH = aGlyph(0) + I_PATH + aGlyph(596);

/* PALAWAN — fine monoline capitals (glyph units: 37 high) */
const PALAWAN: { w: number; d: string }[] = [
  { w: 26, d: "M2 37V8Q10 8 14 17Q15 23 12 28L6 37Z" },
  { w: 30, d: "M2 37L15 0L28 37M8 23H22" },
  { w: 20, d: "M2 0V37H20" },
  { w: 30, d: "M2 37L15 0L28 37M8 23H22" },
  { w: 40, d: "M4 37L10 0L16 15L22 0L28 37" },
  { w: 30, d: "M2 37L15 0L28 37M8 23H22" },
  { w: 26, d: "M4 37V0H24V37" },
];

function palawanPaths(x0: number, y0: number, scale: number, totalWidth: number): string {
  const glyphWidth = PALAWAN.reduce((sum, g) => sum + g.w, 0) * scale;
  const gap = (totalWidth - glyphWidth) / (PALAWAN.length - 1);
  let x = x0;
  let out = "";
  for (const g of PALAWAN) {
    out += `<path transform="translate(${r1(x)} ${r1(y0)}) scale(${scale})" d="${g.d}"/>`;
    x += g.w * scale + gap;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Builder                                                             */
/* ------------------------------------------------------------------ */
const VIEWBOX: Record<LogoLayout, [number, number, number, number]> = {
  stacked: [202, 216, 1501, 1200],
  horizontal: [8, -8, 1554, 358],
  wordmark: [380, 846, 1165, 426],
  mark: [739, 211, 488, 488],
};

export function buildLogoSvg(o: LogoSvgOptions = {}): string {
  const layout: LogoLayout = o.layout ?? "stacked";
  const tone: LogoTone = o.tone ?? "dark";
  const uid = (o.uid ?? "baia").replace(/[^a-zA-Z0-9_-]/g, "") || "baia";
  const goldBase = isHexColor(o.gold) ? o.gold : LOGO_DEFAULT_GOLD;
  const inkBase = isHexColor(o.ink) ? o.ink : LOGO_DEFAULT_INK;
  const gold = tone === "light" ? shadeHex(goldBase, 0.3) : goldBase;
  const ink = tone === "light" ? "#FBF9F5" : inkBase;
  const subInk = tone === "light" ? "#EAE3D9" : shadeHex(inkBase, -0.35);
  const textured = o.textured ?? layout === "stacked";
  const turns = o.turns ?? (layout === "stacked" ? 7 : layout === "horizontal" ? 6 : 6.5);
  const spiralStroke = o.spiralStroke ?? (layout === "stacked" ? 11 : layout === "horizontal" ? 13 : 14);

  const gid = `baia-g-${uid}`;
  const iid = `baia-i-${uid}`;
  const tid = `baia-t-${uid}`;

  const defs =
    `<defs>` +
    `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shadeHex(gold, 0.14)}"/><stop offset=".55" stop-color="${shadeHex(gold, -0.12)}"/><stop offset="1" stop-color="${shadeHex(gold, 0.08)}"/></linearGradient>` +
    `<linearGradient id="${iid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tone === "light" ? ink : shadeHex(ink, 0.08)}"/><stop offset="1" stop-color="${tone === "light" ? shadeHex(ink, -0.04) : shadeHex(ink, -0.1)}"/></linearGradient>` +
    (textured
      ? `<filter id="${tid}" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="4" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.1 1.45" result="ga"/><feComposite in="d" in2="ga" operator="in"/></filter>`
      : "") +
    `</defs>`;

  const spiral = `<path class="baia-spiral" d="${buildSpiralPath(turns)}"${o.animate ? ' pathLength="1"' : ""} fill="none" stroke="url(#${gid})" stroke-width="${spiralStroke}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const word = `<g class="baia-word" fill="url(#${iid})"><path fill-rule="evenodd" d="${B_PATH}"/><path d="${WORD_PATH}"/></g>`;

  let body = "";
  if (layout === "stacked") {
    body =
      spiral +
      word +
      `<g class="baia-sub" fill="none" stroke="${subInk}" stroke-width="${r1(4 / 1.25)}" stroke-miterlimit="4">${palawanPaths(662, 1206, 1.25, 600)}</g>` +
      `<path class="baia-horizon" d="${buildHorizonPath()}" fill="url(#${gid})"/>`;
  } else if (layout === "horizontal") {
    body =
      `<g transform="translate(-522.7 -163) scale(.715)">${spiral}</g>` +
      `<g transform="translate(25 -866)">${word}</g>` +
      `<g class="baia-sub" fill="none" stroke="${subInk}" stroke-width="${r1(7 / 1.35)}" stroke-miterlimit="4">${palawanPaths(421, 284, 1.35, 1131)}</g>`;
  } else if (layout === "wordmark") {
    body =
      word +
      `<g class="baia-sub" fill="none" stroke="${subInk}" stroke-width="${r1(7 / 1.25)}" stroke-miterlimit="4">${palawanPaths(662, 1206, 1.25, 600)}</g>`;
  } else {
    body = spiral;
  }

  const vb = VIEWBOX[layout];
  const size = o.width ? ` width="${o.width}" height="${Math.round((o.width * vb[3]) / vb[2])}"` : "";
  const cls = `baia-logo baia-logo-${layout}${o.animate ? " baia-logo-animate" : ""}`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(" ")}"${size} class="${cls}" aria-hidden="true" focusable="false">` +
    defs +
    (textured ? `<g filter="url(#${tid})">` : "<g>") +
    body +
    `</g></svg>`
  );
}

export function logoAspectRatio(layout: LogoLayout): number {
  const vb = VIEWBOX[layout];
  return vb[2] / vb[3];
}

export function logoDataUri(o: LogoSvgOptions = {}): string {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(buildLogoSvg(o));
}
