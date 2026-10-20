"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Check, Download, Menu, RotateCcw } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { DEFAULT_SITE_CONFIG } from "@/lib/siteConfig";
import { buildLogoSvg, logoAspectRatio } from "@/lib/logoSvg";
import type { LogoLayout, LogoTone } from "@/lib/logoSvg";
import { FONT_CATEGORIES, FONT_LIBRARY, FONT_PAIRINGS, fontStack, googleFontsHref, googleFontsPreviewHref } from "@/lib/fonts";
import { BaiaLogo } from "@/components/BaiaLogo";
import { LogoUploader } from "../LogoUploader";
import { ColorInput, RangeInput, SectionCard, TabHeader, Toggle, inputCls } from "../fields";
import type { TabProps } from "../fields";

/* ------------------------------------------------------------------ */
/* Logo & Brand                                                        */
/* ------------------------------------------------------------------ */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function logoFile(layout: LogoLayout, tone: LogoTone, b: SiteConfig["brand"], width: number) {
  return buildLogoSvg({ layout, tone, ink: b.logoInk, gold: b.logoGold, uid: `dl${layout}${tone}`, textured: layout === "stacked", width });
}

async function downloadPng(layout: LogoLayout, tone: LogoTone, b: SiteConfig["brand"]) {
  const width = 2000;
  const height = Math.round(width / logoAspectRatio(layout));
  const url = URL.createObjectURL(new Blob([logoFile(layout, tone, b, width)], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not render logo"));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
    canvas.toBlob((blob) => blob && downloadBlob(blob, `baia-logo-${layout}-${tone}.png`), "image/png");
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

const VARIANTS: { id: LogoLayout; label: string; hint: string }[] = [
  { id: "stacked", label: "Full logo", hint: "Spiral, BAIA, PALAWAN & horizon" },
  { id: "wordmark", label: "Wordmark", hint: "BAIA with PALAWAN" },
  { id: "horizontal", label: "Horizontal", hint: "Spiral beside the name" },
  { id: "mark", label: "Spiral only", hint: "Minimal emblem" },
];

function Choice({ active, disabled, onClick, title, hint, children }: { active: boolean; disabled?: boolean; onClick: () => void; title: string; hint: string; children: ReactNode }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${active ? "border-[#C87D55] ring-2 ring-[#C87D55]/20" : "border-[#12232E]/10 hover:border-[#12232E]/25"}`}
    >
      {children}
      <span className="mt-2 flex items-center justify-between gap-2 text-[13px] font-semibold text-[#12232E]">
        {title}
        {active && <Check className="h-4 w-4 text-[#C87D55]" />}
      </span>
      <span className="block text-[11px] text-[#4F6D7A]">{hint}</span>
    </button>
  );
}

export function BrandTab({ data, set, passkey }: TabProps) {
  const b = data.brand;
  const custom = b.logoMode === "custom" && Boolean(b.customLogoUrl);
  const vectorBrand = { ...b, logoMode: "vector" as const };
  const heroImage = data.hero.backgroundMedia.find((m) => m.type === "image")?.url ?? "";
  const solid = b.headerStyle === "solid";
  const heroBg = heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" } : { backgroundColor: "#1d3a4a" };

  return (
    <div className="space-y-6">
      <TabHeader title="Logo & Brand" description="Upload your exact logo, choose how it appears in the header and set its size for desktop and mobile." />

      <SectionCard
        title="Your logo file"
        description="Upload the original logo (PNG, JPG, WEBP or SVG) from your phone or computer. White backgrounds are removed automatically and empty margins trimmed."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <LogoUploader
            passkey={passkey}
            label="Main logo"
            description="Used everywhere on the website."
            value={b.customLogoUrl}
            whitenOnDark={b.autoWhiteOnDark && !b.customLogoLightUrl}
            onChange={(url) =>
              set((d) => {
                d.brand.customLogoUrl = url;
                d.brand.logoMode = url ? "custom" : "vector";
              })
            }
          />
          <LogoUploader
            passkey={passkey}
            label="Light version (optional)"
            description="Shown over the hero photo and in the dark footer."
            value={b.customLogoLightUrl}
            onChange={(url) => set((d) => { d.brand.customLogoLightUrl = url; })}
          />
        </div>
        <Toggle
          label="Show the uploaded logo in white on dark backgrounds"
          hint="Used when no light version is uploaded."
          checked={b.autoWhiteOnDark}
          onChange={(v) => set((d) => { d.brand.autoWhiteOnDark = v; })}
        />
      </SectionCard>

      <SectionCard title="Logo used on the website">
        <div className="grid gap-3 sm:grid-cols-2">
          <Choice active={!custom} onClick={() => set((d) => { d.brand.logoMode = "vector"; })} title="Built-in BAIA logo" hint="Sharp vector redraw — colours adjustable below">
            <span className="bg-checker grid h-28 place-items-center rounded-xl p-3">
              <BaiaLogo layout="stacked" tone="dark" brand={vectorBrand} className="h-24" textured />
            </span>
          </Choice>
          <Choice
            active={custom}
            disabled={!b.customLogoUrl}
            onClick={() => set((d) => { d.brand.logoMode = "custom"; })}
            title="Uploaded logo"
            hint={b.customLogoUrl ? "Your original artwork" : "Upload your logo above first"}
          >
            <span className="bg-checker grid h-28 place-items-center rounded-xl p-3">
              {b.customLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.customLogoUrl} alt="" className="max-h-24 max-w-full object-contain" />
              ) : (
                <span className="text-[11px] text-[#12232E]/40">No upload yet</span>
              )}
            </span>
          </Choice>
        </div>
      </SectionCard>

      <SectionCard title="Header logo" description="Choose the version and size. The previews update instantly — use Preview at the top to see it on the real site.">
        {custom ? (
          <p className="rounded-xl bg-[#FBF9F5] p-3 text-xs text-[#4F6D7A]">Your uploaded logo is shown in the header. Switch to the built-in logo to choose a different version.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {VARIANTS.map((v) => (
              <Choice key={v.id} active={b.headerLogoVariant === v.id} onClick={() => set((d) => { d.brand.headerLogoVariant = v.id; })} title={v.label} hint={v.hint}>
                <span className="grid h-20 place-items-center rounded-xl bg-[#FBF9F5] p-2">
                  <BaiaLogo layout={v.id} tone="dark" brand={vectorBrand} textured={false} className="h-12" />
                </span>
              </Choice>
            ))}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <RangeInput label="Logo size · desktop & tablet" value={b.headerLogoHeight} min={28} max={140} unit="px" onChange={(v) => set((d) => { d.brand.headerLogoHeight = v; })} />
          <RangeInput label="Logo size · mobile" value={b.headerLogoHeightMobile} min={24} max={110} unit="px" onChange={(v) => set((d) => { d.brand.headerLogoHeightMobile = v; })} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Choice active={!solid} onClick={() => set((d) => { d.brand.headerStyle = "transparent"; })} title="Transparent over the hero" hint="White logo on the photo, solid bar after scrolling">
            <span className="flex h-14 items-center rounded-xl px-3" style={heroBg}>
              <BaiaLogo layout={custom ? "stacked" : b.headerLogoVariant} tone="light" brand={b} textured={false} className="h-10" />
            </span>
          </Choice>
          <Choice active={solid} onClick={() => set((d) => { d.brand.headerStyle = "solid"; })} title="Solid light bar" hint="Logo always in its original colours">
            <span className="flex h-14 items-center rounded-xl bg-[#FBF9F5] px-3 ring-1 ring-[#12232E]/10">
              <BaiaLogo layout={custom ? "stacked" : b.headerLogoVariant} tone="dark" brand={b} textured={false} className="h-10" />
            </span>
          </Choice>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
          <div className="overflow-hidden rounded-2xl ring-1 ring-[#12232E]/10">
            <div className="relative" style={heroBg}>
              <div className={`flex items-center justify-between gap-3 px-5 py-3 ${solid ? "bg-[#FBF9F5]/90 backdrop-blur" : "bg-gradient-to-b from-black/50 to-transparent"}`}>
                <BaiaLogo layout={b.headerLogoVariant} tone={solid ? "dark" : "light"} brand={b} textured={false} height={b.headerLogoHeight} />
                <span className={`btn btn-sm pointer-events-none ${solid ? "btn-outline" : "btn-glass"}`}>Book your stay</span>
              </div>
              <div className="h-20" />
            </div>
            <div className="flex items-center justify-between gap-3 bg-[#FBF9F5] px-5 py-2.5">
              <BaiaLogo layout={b.headerLogoVariant} tone="dark" brand={b} textured={false} height={Math.round(b.headerLogoHeight * 0.8)} />
              <span className="text-[10px] uppercase tracking-widest text-[#12232E]/40">Desktop · after scrolling</span>
            </div>
          </div>
          <div className="mx-auto w-[230px] overflow-hidden rounded-[1.75rem] ring-[6px] ring-[#12232E]">
            <div className="relative h-[210px]" style={heroBg}>
              <div className={`flex items-center justify-between gap-2 px-3 py-2.5 ${solid ? "bg-[#FBF9F5]/90" : "bg-gradient-to-b from-black/50 to-transparent"}`}>
                <BaiaLogo layout={b.headerLogoVariant} tone={solid ? "dark" : "light"} brand={b} textured={false} height={b.headerLogoHeightMobile} />
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${solid ? "text-[#12232E] ring-[#12232E]/20" : "text-white ring-white/40"}`}>
                  <Menu className="h-4 w-4" />
                </span>
              </div>
              <span className="absolute bottom-2 left-3 text-[9px] uppercase tracking-widest text-white/70">Mobile</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Footer logo & hero emblem">
        <RangeInput label="Footer logo width" value={b.footerLogoWidth} min={100} max={420} unit="px" onChange={(v) => set((d) => { d.brand.footerLogoWidth = v; })} />
        <div className="flex items-center justify-center overflow-hidden rounded-2xl bg-[#12232E] p-6">
          <BaiaLogo layout="stacked" tone="light" brand={b} textured width={b.footerLogoWidth} />
        </div>
        <Toggle
          label="Animated spiral above the hero headline"
          hint="Built-in logo only."
          checked={b.showHeroEmblem}
          onChange={(v) => set((d) => { d.brand.showHeroEmblem = v; })}
        />
      </SectionCard>

      <SectionCard
        title="Built-in logo colours & downloads"
        description="Adjust the wordmark ink and the gold of the spiral and horizon. Download transparent files for print and social media."
        actions={
          <button
            type="button"
            onClick={() => set((d) => { d.brand.logoInk = DEFAULT_SITE_CONFIG.brand.logoInk; d.brand.logoGold = DEFAULT_SITE_CONFIG.brand.logoGold; })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#12232E]/15 px-3 py-2 text-[11px] font-semibold text-[#12232E] hover:bg-[#12232E]/5"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Original colours
          </button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorInput label="Wordmark ink" value={b.logoInk} onChange={(v) => set((d) => { d.brand.logoInk = v; })} />
          <ColorInput label="Spiral & horizon gold" value={b.logoGold} onChange={(v) => set((d) => { d.brand.logoGold = v; })} />
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["SVG · full logo", () => downloadBlob(new Blob([logoFile("stacked", "dark", b, 1600)], { type: "image/svg+xml" }), "baia-logo.svg")],
              ["SVG · full logo (light)", () => downloadBlob(new Blob([logoFile("stacked", "light", b, 1600)], { type: "image/svg+xml" }), "baia-logo-light.svg")],
              ["SVG · wordmark", () => downloadBlob(new Blob([logoFile("wordmark", "dark", b, 1600)], { type: "image/svg+xml" }), "baia-wordmark.svg")],
              ["PNG · transparent 2000px", () => downloadPng("stacked", "dark", b)],
              ["PNG · spiral mark", () => downloadPng("mark", "dark", b)],
            ] as const
          ).map(([label, fn]) => (
            <button key={label} type="button" onClick={() => void fn()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#12232E] px-3.5 py-2 text-[11px] font-semibold text-white transition hover:bg-[#C87D55]">
              <Download className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */
const SAMPLE = "BAIA Palawan Aa Private Beachfront Luxury in Paradise";

export function TypographyTab({ data, set }: TabProps) {
  const t = data.theme;
  const [scope, setScope] = useState<"heading" | "body">("heading");
  const [query, setQuery] = useState("");
  const previewHref = useMemo(() => googleFontsPreviewHref(FONT_LIBRARY.map((f) => f.family), SAMPLE), []);
  const fullHref = googleFontsHref([t.fontSerif, t.fontSans], true);
  const selected = scope === "heading" ? t.fontSerif : t.fontSans;
  const q = query.trim().toLowerCase();
  const filtered = FONT_LIBRARY.filter((f) => !q || f.family.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.note.toLowerCase().includes(q));

  const apply = (family: string) =>
    set((d) => {
      if (scope === "heading") d.theme.fontSerif = family;
      else d.theme.fontSans = family;
    });

  return (
    <div className="space-y-6">
      <link rel="stylesheet" href={previewHref} precedence="baia-admin-fonts" />
      {fullHref && <link rel="stylesheet" href={fullHref} precedence="baia-admin-fonts" />}

      <TabHeader title="Typography" description="50 professional Google Fonts curated for luxury hospitality, plus designer pairings. Publish to apply site-wide." />

      <div className="overflow-hidden rounded-3xl border border-[#12232E]/10 bg-[#FBF9F5]">
        <div className="p-6 sm:p-9">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C87D55]" style={{ fontFamily: fontStack(t.fontSans) }}>
            A mini sanctuary for inner work &amp; reflection
          </p>
          <h3 className="mt-3 text-4xl font-light leading-[1.05] text-[#12232E] sm:text-6xl" style={{ fontFamily: fontStack(t.fontSerif) }}>
            Private Beachfront <em className="font-light">Luxury in Paradise</em>
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#4F6D7A]" style={{ fontFamily: fontStack(t.fontSans) }}>
            Situated in the heart of the serene fishing village of Sitio Panindigan, BAIA is an exclusive 3-cottage beachfront haven — designed for quiet luxury, calm waters and deep relaxation.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-[#12232E]/10 bg-white px-6 py-3 text-[11px] text-[#4F6D7A]">
          <span>
            Headings: <b className="text-[#12232E]">{t.fontSerif}</b>
          </span>
          <span>
            Body: <b className="text-[#12232E]">{t.fontSans}</b>
          </span>
        </div>
      </div>

      <SectionCard title="Designer pairings" description="One click applies a balanced heading + body combination.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {FONT_PAIRINGS.map((p) => {
            const active = p.heading === t.fontSerif && p.body === t.fontSans;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => set((d) => { d.theme.fontSerif = p.heading; d.theme.fontSans = p.body; })}
                className={`rounded-2xl border p-4 text-left transition ${active ? "border-[#C87D55] bg-[#C87D55]/5 ring-2 ring-[#C87D55]/20" : "border-[#12232E]/10 bg-white hover:border-[#12232E]/25"}`}
              >
                <span className="block text-[26px] leading-tight text-[#12232E]" style={{ fontFamily: fontStack(p.heading) }}>
                  BAIA Palawan
                </span>
                <span className="mt-1 block text-xs text-[#4F6D7A]" style={{ fontFamily: fontStack(p.body) }}>
                  Private Beachfront Luxury in Paradise
                </span>
                <span className="mt-3 flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider">
                  <b className="text-[#12232E]">{p.name}</b>
                  <span className="truncate text-[#4F6D7A]">{p.mood}</span>
                </span>
                <span className="mt-1 block text-[10px] text-[#4F6D7A]">
                  {p.heading} + {p.body}
                </span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Font library"
        description="Choose the role, then pick any font — names preview in their own typeface."
        actions={
          <div className="flex rounded-full bg-[#12232E]/5 p-1">
            {(["heading", "body"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setScope(s)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${scope === s ? "bg-[#12232E] text-white" : "text-[#12232E]/70"}`}>
                {s === "heading" ? "Heading font" : "Body font"}
              </button>
            ))}
          </div>
        }
      >
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fonts or styles — e.g. Didone, Garamond, Geometric…" className={inputCls} />
        {FONT_CATEGORIES.map((cat) => {
          const fonts = filtered.filter((f) => f.category === cat);
          if (!fonts.length) return null;
          return (
            <div key={cat}>
              <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#4F6D7A]">{cat}</h5>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {fonts.map((f) => {
                  const active = selected === f.family;
                  return (
                    <button
                      key={f.family}
                      type="button"
                      onClick={() => apply(f.family)}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition ${active ? "border-[#C87D55] bg-[#C87D55]/5" : "border-[#12232E]/10 bg-white hover:border-[#12232E]/25"}`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[21px] leading-tight text-[#12232E]" style={{ fontFamily: fontStack(f.family) }}>
                          {f.family}
                        </span>
                        <span className="block truncate text-[11px] text-[#4F6D7A]">{f.note}</span>
                      </span>
                      {active && <Check className="h-4 w-4 shrink-0 text-[#C87D55]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Colours                                                             */
/* ------------------------------------------------------------------ */
type ColorKey = "colorBackground" | "colorNavy" | "colorAccent" | "colorOcean" | "colorMuted" | "colorDriftwood" | "colorShell";

const TOKENS: { key: ColorKey; label: string; hint: string }[] = [
  { key: "colorBackground", label: "Sand Ivory", hint: "Main background" },
  { key: "colorNavy", label: "Deep Marine Navy", hint: "Text, dark sections, footer" },
  { key: "colorAccent", label: "Warm Terracotta", hint: "Accents & highlights" },
  { key: "colorOcean", label: "Slate Ocean", hint: "Secondary text" },
  { key: "colorMuted", label: "Sage Green", hint: "Subtle accents" },
  { key: "colorDriftwood", label: "Driftwood", hint: "Soft tints" },
  { key: "colorShell", label: "Shell", hint: "Alternate section background" },
];

const PALETTES: { name: string; colors: Record<ColorKey, string> }[] = [
  { name: "BAIA Original", colors: { colorBackground: "#FBF9F5", colorNavy: "#12232E", colorAccent: "#C87D55", colorOcean: "#4F6D7A", colorMuted: "#7A9A8B", colorDriftwood: "#EAE3D9", colorShell: "#F5F2EB" } },
  { name: "Palawan Lagoon", colors: { colorBackground: "#F7FAF9", colorNavy: "#0E2A33", colorAccent: "#1F8A8A", colorOcean: "#3F6B73", colorMuted: "#86A99E", colorDriftwood: "#DCE9E6", colorShell: "#EEF5F3" } },
  { name: "Sunset Terracotta", colors: { colorBackground: "#FCF8F3", colorNavy: "#2A1D17", colorAccent: "#B9573A", colorOcean: "#7A5A4B", colorMuted: "#A3A07E", colorDriftwood: "#EFE2D3", colorShell: "#F7EEE4" } },
  { name: "Sage Sanctuary", colors: { colorBackground: "#F8F8F3", colorNavy: "#1E2B24", colorAccent: "#8C7B4F", colorOcean: "#55675C", colorMuted: "#8FA58E", colorDriftwood: "#E4E6DA", colorShell: "#F0F1E8" } },
  { name: "Midnight Coast", colors: { colorBackground: "#F6F5F2", colorNavy: "#0B1622", colorAccent: "#C9A46A", colorOcean: "#47607A", colorMuted: "#7D93A6", colorDriftwood: "#E3DFD6", colorShell: "#EFEDE7" } },
  { name: "Sandstone Minimal", colors: { colorBackground: "#FAF8F5", colorNavy: "#2B2B2B", colorAccent: "#A68A64", colorOcean: "#6E6A64", colorMuted: "#A9A79C", colorDriftwood: "#ECE6DC", colorShell: "#F3EFE8" } },
];

export function ColorsTab({ data, set }: TabProps) {
  const t = data.theme;
  return (
    <div className="space-y-6">
      <TabHeader title="Colour Palette" description="Curated coastal palettes or your own tokens. Every section, button and badge follows these colours." />

      <SectionCard title="Curated palettes">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PALETTES.map((p) => {
            const active = TOKENS.every((tk) => t[tk.key].toUpperCase() === p.colors[tk.key].toUpperCase());
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => set((d) => { Object.assign(d.theme, p.colors); })}
                className={`rounded-2xl border p-3 text-left transition ${active ? "border-[#C87D55] ring-2 ring-[#C87D55]/20" : "border-[#12232E]/10 hover:border-[#12232E]/25"}`}
              >
                <span className="flex h-12 overflow-hidden rounded-xl">
                  {TOKENS.map((tk) => (
                    <span key={tk.key} className="flex-1" style={{ backgroundColor: p.colors[tk.key] }} />
                  ))}
                </span>
                <span className="mt-2 flex items-center justify-between text-xs font-semibold text-[#12232E]">
                  {p.name}
                  {active && <Check className="h-4 w-4 text-[#C87D55]" />}
                </span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Brand tokens">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TOKENS.map((tk) => (
            <ColorInput key={tk.key} label={tk.label} hint={tk.hint} value={t[tk.key]} onChange={(v) => set((d) => { d.theme[tk.key] = v; })} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Live preview">
        <div className="overflow-hidden rounded-2xl border border-[#12232E]/10" style={{ backgroundColor: t.colorBackground }}>
          <div className="grid sm:grid-cols-2">
            <div className="p-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: t.colorAccent }}>
                Sanctuary cottages
              </span>
              <h4 className="mt-2 font-serif-luxury text-3xl" style={{ color: t.colorNavy }}>
                Crafted for quiet stillness
              </h4>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: t.colorOcean }}>
                Only three private cottages on the shoreline of Sitio Panindigan.
              </p>
              <span className="mt-4 inline-block rounded-full border px-5 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ borderColor: t.colorNavy, color: t.colorNavy }}>
                Reserve
              </span>
            </div>
            <div className="p-6" style={{ backgroundColor: t.colorNavy }}>
              <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: t.colorAccent }}>
                Book direct
              </span>
              <h4 className="mt-2 font-serif-luxury text-3xl" style={{ color: t.colorBackground }}>
                The sanctuary gives back
              </h4>
              <div className="mt-4 rounded-xl p-3 text-[11px]" style={{ backgroundColor: t.colorShell, color: t.colorNavy }}>
                Alternate section background
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
