"use client";

import { useState } from "react";
import { ArrowUpRight, Clock } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { SectionHeading } from "./SectionHeading";

interface DiningSectionProps {
  diningData: SiteConfig["dining"];
  onOpenBooking: () => void;
}

export function DiningSection({ diningData, onOpenBooking }: DiningSectionProps) {
  const menus = diningData.menus;
  const [activeId, setActiveId] = useState(menus[0]?.id ?? "");
  const menu = menus.find((m) => m.id === activeId) ?? menus[0];
  if (!menu) return null;

  return (
    <section id="dining" className="section-y bg-shell">
      <div className="container-x">
        <SectionHeading eyebrow={diningData.badge} title={diningData.title} subtitle={diningData.subtitle} />

        {menus.length > 1 && (
          <div role="tablist" aria-label="Menus" className="chip-grid mt-10 sm:mt-12">
            {menus.map((m) => (
              <button key={m.id} type="button" role="tab" aria-selected={m.id === menu.id} onClick={() => setActiveId(m.id)} className="chip">
                {m.name}
              </button>
            ))}
          </div>
        )}

        <div key={menu.id} className="animate-fade-in mt-8 grid grid-cols-1 overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-navy/[0.07] lg:grid-cols-12">
          <div className="relative aspect-[16/10] lg:col-span-5 lg:aspect-auto lg:min-h-[34rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={menu.image} alt={menu.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/10 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-7 sm:bottom-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] ring-1 ring-white/25 backdrop-blur-md">
                <Clock className="h-3 w-3" />
                {menu.hours}
              </span>
              <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-white/85">{menu.tagline}</p>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
            <h3 className="font-serif-luxury text-[1.9rem] font-light leading-tight text-navy sm:text-4xl">{menu.name}</h3>
            <p className="lead mt-3">{menu.description}</p>

            <ul className="mt-8 divide-y divide-navy/[0.08]">
              {menu.dishes.map((dish, i) => (
                <li key={i} className="py-4 first:pt-0">
                  <div className="flex items-baseline gap-3">
                    <h4 className="font-serif-luxury text-[1.2rem] leading-snug text-navy sm:text-[1.35rem]">{dish.name}</h4>
                    {dish.tag && (
                      <span className="hidden shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-terracotta ring-1 ring-terracotta/35 sm:inline">
                        {dish.tag}
                      </span>
                    )}
                    <span aria-hidden="true" className="hidden flex-1 -translate-y-1 border-b border-dotted border-navy/25 sm:block" />
                    <span className="ml-auto shrink-0 font-serif-luxury text-lg text-navy sm:ml-0">{dish.price}</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-ocean">{dish.description}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-4 border-t border-navy/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-ocean">Vegan, gluten-free & pescatarian dishes on request.</p>
              <button type="button" onClick={onOpenBooking} className="btn btn-outline w-full sm:w-auto">
                Reserve private dining
                <ArrowUpRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
