"use client";

import { useId, useMemo } from "react";
import type { CSSProperties } from "react";
import { buildLogoSvg } from "@/lib/logoSvg";
import type { LogoLayout, LogoTone } from "@/lib/logoSvg";
import type { SiteConfig } from "@/lib/siteConfig";

interface BaiaLogoProps {
  layout?: LogoLayout;
  tone?: LogoTone;
  brand?: SiteConfig["brand"];
  height?: number;
  width?: number;
  textured?: boolean;
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
  label?: string;
}

/**
 * Transparent BAIA logo. Renders the built-in vector logo, or the admin-uploaded
 * logo when `brand.logoMode === "custom"`. `tone="light"` adapts it for dark backgrounds.
 */
export function BaiaLogo({
  layout = "horizontal",
  tone = "dark",
  brand,
  height,
  width,
  textured,
  animate = false,
  className = "",
  style,
  label = "BAIA Palawan",
}: BaiaLogoProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const svg = useMemo(
    () =>
      buildLogoSvg({
        layout,
        tone,
        ink: brand?.logoInk,
        gold: brand?.logoGold,
        uid,
        textured,
        animate,
      }),
    [layout, tone, brand?.logoInk, brand?.logoGold, uid, textured, animate]
  );

  const sizeStyle: CSSProperties = {
    ...(height ? { height } : {}),
    ...(width ? { width } : {}),
    ...style,
  };

  if (brand?.logoMode === "custom" && brand.customLogoUrl && layout !== "mark") {
    const useLightFile = tone === "light" && brand.customLogoLightUrl;
    const src = useLightFile ? brand.customLogoLightUrl : brand.customLogoUrl;
    const whiten = tone === "light" && !useLightFile && brand.autoWhiteOnDark;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={label}
        className={`block object-contain ${className}`}
        style={{
          ...(height ? { height, width: "auto" } : {}),
          ...(width ? { width, height: "auto" } : {}),
          filter: whiten ? "brightness(0) invert(1)" : undefined,
          ...style,
        }}
        draggable={false}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={label}
      className={`baia-logo-wrap inline-block leading-none ${width && !height ? "[&>svg]:!w-full [&>svg]:!h-auto" : ""} ${className}`}
      style={sizeStyle}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
