import { Globe, Mail } from "lucide-react";
import { SIMPLE_ICON_PATHS } from "@/lib/simpleIconPaths";
import { CUSTOM_GLYPHS } from "@/lib/platforms";

interface BrandIconProps {
  glyph: string;
  className?: string;
  /** use the official brand colours instead of currentColor */
  colored?: boolean;
  title?: string;
}

export function BrandIcon({ glyph, className = "w-4 h-4", colored = false, title }: BrandIconProps) {
  if (glyph === "email") return <Mail className={className} strokeWidth={1.7} aria-hidden="true" />;
  if (glyph === "website") return <Globe className={className} strokeWidth={1.7} aria-hidden="true" />;

  const custom = CUSTOM_GLYPHS[glyph];
  if (custom) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        aria-label={title}
        dangerouslySetInnerHTML={{ __html: colored ? custom.colored : custom.mono }}
      />
    );
  }

  const icon = SIMPLE_ICON_PATHS[glyph];
  if (!icon) return <Globe className={className} aria-hidden="true" />;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={colored ? icon.hex : "currentColor"}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={icon.path} />
    </svg>
  );
}
