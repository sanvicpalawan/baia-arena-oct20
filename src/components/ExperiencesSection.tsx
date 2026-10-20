"use client";

import { useState } from "react";
import { ArrowUpRight, Check, HeartHandshake, Plane, Sparkles, UtensilsCrossed, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { SectionHeading } from "./SectionHeading";

const TAB_ICONS: Record<string, LucideIcon> = {
  "beachfront-water": Waves,
  "dining-culinary": UtensilsCrossed,
  "wellness-peace": HeartHandshake,
  conveniences: Plane,
};

interface ExperiencesProps {
  experiencesData: SiteConfig["experiences"];
  onOpenBooking: () => void;
}

export function ExperiencesSection({ experiencesData, onOpenBooking }: ExperiencesProps) {
  const items = experiencesData.items;
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const active = items.find((e) => e.id === activeId) ?? items[0];
  if (!active) return null;

  return (
    <section id="experiences" className="section-y relative overflow-hidden bg-navy text-sand">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-terracotta/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-ocean/25 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading tone="dark" eyebrow={experiencesData.badge} title={experiencesData.title} subtitle={experiencesData.subtitle} />

        <div role="tablist" aria-label="Experiences" className="chip-grid mt-10 sm:mt-12">
          {items.map((it) => {
            const Icon = TAB_ICONS[it.id] ?? Sparkles;
            return (
              <button key={it.id} type="button" role="tab" aria-selected={it.id === active.id} onClick={() => setActiveId(it.id)} className="chip chip-dark">
                <Icon />
                {it.tabTitle}
              </button>
            );
          })}
        </div>

        <div key={active.id} className="animate-fade-in mt-8 grid grid-cols-1 items-center gap-8 sm:mt-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] lg:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.image} alt={active.tabTitle} loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/10 px-4 py-3 text-xs text-white ring-1 ring-white/20 backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-auto">
              {active.tagline}
            </span>
          </div>

          <div className="lg:order-1">
            <p className="eyebrow">{active.badge}</p>
            <h3 className="mt-4 font-serif-luxury text-[1.85rem] font-light leading-[1.15] text-white sm:text-4xl">{active.headline}</h3>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-sand/70">{active.description}</p>
            <ul className="mt-6 space-y-3">
              {active.features.map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm font-light leading-relaxed text-sand/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" strokeWidth={1.8} />
                  {feature}
                </li>
              ))}
            </ul>
            <button type="button" onClick={onOpenBooking} className="btn btn-glass mt-8 w-full sm:w-auto">
              Plan this experience
              <ArrowUpRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
