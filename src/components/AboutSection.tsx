"use client";

import { Anchor, BedDouble, MapPin, Utensils, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { SectionHeading } from "./SectionHeading";

const ICONS: Record<string, LucideIcon> = { Waves, Anchor, BedDouble, Utensils };

export function AboutSection({ aboutData }: { aboutData: SiteConfig["about"] }) {
  const a = aboutData;
  return (
    <section id="about" className="section-y relative bg-sand">
      <div className="container-x">
        <SectionHeading eyebrow={a.badge} title={a.headline} />

        <div className="mt-12 grid grid-cols-1 items-center gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-5">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] sm:aspect-[16/10] lg:aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.imageTall}
                alt="The beach at BAIA, Sitio Panindigan"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-2.5 rounded-2xl bg-white/10 px-4 py-3 text-xs text-white ring-1 ring-white/20 backdrop-blur-md sm:inset-x-6 sm:bottom-6">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-driftwood" />
                Sitio Panindigan, San Vicente — steps from the water
              </div>
            </div>
            {a.imageSecondary && (
              <div className="absolute -bottom-8 right-6 hidden aspect-square w-40 overflow-hidden rounded-[1.25rem] ring-8 ring-sand xl:block xl:w-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.imageSecondary} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <p className="eyebrow">{a.subheadline}</p>
            <div className="mt-6 space-y-4">
              <p className="text-[17px] font-light leading-relaxed text-navy/85 sm:text-lg">{a.paragraph1}</p>
              <p className="lead">{a.paragraph2}</p>
            </div>

            <ul className="mt-9 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-navy/[0.08] ring-1 ring-navy/[0.08] sm:grid-cols-2">
              {a.highlights.map((h, i) => {
                const Icon = ICONS[h.icon] ?? Waves;
                return (
                  <li key={i} className="flex items-start gap-4 bg-white p-5 sm:last:odd:col-span-2">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-terracotta ring-1 ring-navy/10">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold leading-snug text-navy">{h.title}</span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-ocean">{h.desc}</span>
                    </span>
                  </li>
                );
              })}
            </ul>

            {a.quote && (
              <blockquote className="mt-9 border-l border-terracotta/60 pl-5 font-serif-luxury text-xl italic leading-snug text-navy/80 sm:text-2xl">
                &ldquo;{a.quote}&rdquo;
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
