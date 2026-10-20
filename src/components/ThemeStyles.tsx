import type { SiteConfig } from "@/lib/siteConfig";
import { DEFAULT_BODY_FONT, DEFAULT_HEADING_FONT, findFont, fontStack, googleFontsHref } from "@/lib/fonts";
import { isHexColor } from "@/lib/logoSvg";

export function buildThemeCss(theme: SiteConfig["theme"]): string {
  const c = (value: string, fallback: string) => (isHexColor(value) ? value : fallback);
  const vars = [
    `--sand-ivory:${c(theme.colorBackground, "#FBF9F5")}`,
    `--marine-navy:${c(theme.colorNavy, "#12232E")}`,
    `--warm-terracotta:${c(theme.colorAccent, "#C87D55")}`,
    `--slate-ocean:${c(theme.colorOcean, "#4F6D7A")}`,
    `--sage-green:${c(theme.colorMuted, "#7A9A8B")}`,
    `--driftwood:${c(theme.colorDriftwood, "#EAE3D9")}`,
    `--shell:${c(theme.colorShell, "#F5F2EB")}`,
  ];
  if (findFont(theme.fontSerif) && theme.fontSerif !== DEFAULT_HEADING_FONT) {
    vars.push(`--font-heading:${fontStack(theme.fontSerif)}`);
  }
  if (findFont(theme.fontSans) && theme.fontSans !== DEFAULT_BODY_FONT) {
    vars.push(`--font-body:${fontStack(theme.fontSans)}`);
  }
  return `html:root{${vars.join(";")}}`;
}

/** Injects the admin-selected palette + Google Fonts. Server-rendered, so no flash of defaults. */
export function ThemeStyles({ theme }: { theme: SiteConfig["theme"] }) {
  const href = googleFontsHref([theme.fontSerif, theme.fontSans]);
  return (
    <>
      {href && <link rel="stylesheet" href={href} precedence="default" />}
      <style dangerouslySetInnerHTML={{ __html: buildThemeCss(theme) }} />
    </>
  );
}
