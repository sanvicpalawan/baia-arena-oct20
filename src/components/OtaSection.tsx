"use client";

import { useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import {
  ArrowUpRight,
  BadgePercent,
  CalendarCheck,
  Coffee,
  Gift,
  Info,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Waves,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { otaInfo } from "@/lib/platforms";
import { BrandIcon } from "./BrandIcon";

export const PERK_ICONS: Record<string, LucideIcon> = {
  BadgePercent,
  Plane,
  Wine,
  Coffee,
  CalendarCheck,
  MessageCircle,
  Sparkles,
  Gift,
  ShieldCheck,
  Waves,
  Star,
};

function Magnetic({ children, onClick, className = "" }: { children: ReactNode; onClick: () => void; className?: string }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const onMove = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOffset({ x: (e.clientX - (r.left + r.width / 2)) * 0.18, y: (e.clientY - (r.top + r.height / 2)) * 0.28 });
  };
  return (
    <button
      type="button"
      data-magnetic
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      className={className}
    >
      {children}
    </button>
  );
}

interface OtaSectionProps {
  otaData: SiteConfig["otaLinks"];
  fromPrice: number;
  onDirectBook: () => void;
  onAskHost: () => void;
}

export function OtaSection({ otaData, fromPrice, onDirectBook, onAskHost }: OtaSectionProps) {
  const links = otaData.links.filter((l) => l.active && l.url);
  const savings = Math.max(0, Math.min(60, Number(otaData.savingsPercent) || 0));
  const otaPrice = Math.round(fromPrice * (1 + savings / 100));
  const hasPanel = links.length > 0;

  return (
    <section id="book-direct" aria-labelledby="book-direct-title" className="section-y bg-sand">
      <div className="container-x">
        <div className={`grid grid-cols-1 gap-5 lg:gap-6 ${hasPanel ? "lg:grid-cols-12" : ""}`}>
          <div className={`relative overflow-hidden rounded-[1.75rem] bg-navy p-6 text-sand sm:p-10 lg:p-12 ${hasPanel ? "lg:col-span-7" : ""}`}>
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-terracotta/20 blur-3xl" />
            <div className="relative">
              <p className="eyebrow">{otaData.eyebrow}</p>
              <h2 id="book-direct-title" className="h-section mt-4 max-w-xl text-sand">
                {otaData.title}
              </h2>
              <p className="mt-4 max-w-lg text-[15px] font-light leading-relaxed text-sand/70">{otaData.subtitle}</p>

              {otaData.perks.length > 0 && (
                <ul className="mt-8 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
                  {otaData.perks.map((perk, i) => {
                    const Icon = PERK_ICONS[perk.icon] ?? Sparkles;
                    return (
                      <li key={i} className="flex items-center gap-3 text-sm text-sand/85">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ring-white/15">
                          <Icon className="h-3.5 w-3.5 text-terracotta" strokeWidth={1.8} />
                        </span>
                        {perk.text}
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="mt-9 flex flex-col gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-sand/50">Direct rate from</span>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-serif-luxury text-5xl font-light">${fromPrice}</span>
                    <span className="text-sm text-sand/50">/ night</span>
                    {savings > 0 && (
                      <span className="text-sm text-sand/35 line-through decoration-terracotta/70" title="Typical booking-site price incl. fees">
                        ${otaPrice}
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] text-sand/85 ring-1 ring-white/15">
                      <BadgePercent className="h-3.5 w-3.5 text-terracotta" />
                      Save up to {savings}% vs. booking sites
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <Magnetic onClick={onDirectBook} className="btn btn-light w-full sm:w-auto">
                    {otaData.directCtaText}
                    <ArrowUpRight />
                  </Magnetic>
                  <button type="button" onClick={onAskHost} className="btn btn-glass w-full sm:w-auto">
                    <Sparkles />
                    {otaData.secondaryCtaText}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {hasPanel && (
            <div className="flex flex-col rounded-[1.75rem] bg-white p-6 ring-1 ring-navy/[0.07] sm:p-9 lg:col-span-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ocean">{otaData.panelTitle}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-ocean">
                  <ShieldCheck className="h-3.5 w-3.5 text-sage" />
                  Verified
                </span>
              </div>
              <p className="mt-3 font-serif-luxury text-[1.6rem] font-light leading-snug text-navy">{otaData.panelSubtitle}</p>

              <ul className="mt-7 flex flex-col gap-3">
                {links.map((link) => {
                  const info = otaInfo(link.platform);
                  const fiveScale = info.scale === "5";
                  return (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        aria-label={`View BAIA on ${link.name} (opens in a new tab)`}
                        className="group flex items-center gap-4 rounded-2xl bg-sand/70 px-4 py-3.5 ring-1 ring-navy/[0.07] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_40px_-26px_rgba(18,35,46,0.45)] hover:ring-navy/15"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-black/5" style={{ backgroundColor: info.tile, color: info.ink }}>
                          <BrandIcon glyph={info.glyph} colored={link.platform === "agoda"} className="h-[22px] w-[22px]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-navy">{link.name}</span>
                          {(link.rating || link.ratingLabel) && (
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-ocean">
                              {link.rating && (
                                <span className="inline-flex items-center gap-1 font-semibold text-navy">
                                  {fiveScale && <Star className="h-3 w-3 fill-terracotta text-terracotta" />}
                                  {link.rating}
                                  {!fiveScale && <span className="font-normal text-ocean/70">/10</span>}
                                </span>
                              )}
                              {link.ratingLabel && <span>{link.ratingLabel}</span>}
                              {link.reviewCount && <span>· {link.reviewCount} reviews</span>}
                            </span>
                          )}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/70 ring-1 ring-navy/15 transition-colors group-hover:bg-navy group-hover:text-sand group-hover:ring-navy">
                          View
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-auto flex gap-2 pt-7 text-[11px] leading-relaxed text-ocean">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {otaData.footnote}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
