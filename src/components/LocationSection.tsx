"use client";

import { useState } from "react";
import { ArrowUpRight, Hand, Navigation, Plane, X } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { formatCoords, mapEmbedUrl, mapsDirectionsUrl, mapsOpenUrl } from "@/lib/maps";
import type { MapView } from "@/lib/maps";
import { SectionHeading } from "./SectionHeading";

interface LocationSectionProps {
  locationData: SiteConfig["location"];
  address: string;
}

export function LocationSection({ locationData: l, address }: LocationSectionProps) {
  const [view, setView] = useState<MapView>(l.mapType);
  const [interactive, setInteractive] = useState(false);
  const src = mapEmbedUrl(l.mapLat, l.mapLng, l.mapZoom, view);
  const coords = formatCoords(l.mapLat, l.mapLng);

  return (
    <section id="location" className="section-y bg-sand">
      <div className="container-x">
        <SectionHeading eyebrow={l.badge} title={l.title} subtitle={l.subtitle} />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 lg:grid-cols-12 lg:gap-6">
          <div
            className="relative isolate overflow-hidden rounded-[1.75rem] bg-shell ring-1 ring-navy/10 lg:col-span-7"
            onMouseLeave={() => setInteractive(false)}
          >
            <div className="relative aspect-square sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[36rem]">
              <iframe
                key={src}
                src={src}
                title={`Map showing BAIA Palawan — ${address}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />

              {!interactive && (
                <button
                  type="button"
                  onClick={() => setInteractive(true)}
                  aria-label="Explore the map"
                  className="group absolute inset-0 z-10 flex items-end justify-center pb-12"
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-navy/85 px-4 py-2 text-[11px] font-medium text-white shadow-lg backdrop-blur transition group-hover:bg-navy">
                    <Hand className="h-3.5 w-3.5" />
                    Tap to explore the map
                  </span>
                </button>
              )}

              <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
                <div className="inline-flex rounded-full bg-white/95 p-1 shadow-[0_8px_24px_-12px_rgba(18,35,46,0.5)] ring-1 ring-navy/10">
                  {(["map", "satellite"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setView(v)}
                      aria-pressed={view === v}
                      className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold capitalize transition ${view === v ? "bg-navy text-sand" : "text-navy/70 hover:text-navy"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {interactive && (
                  <button
                    type="button"
                    onClick={() => setInteractive(false)}
                    aria-label="Lock the map"
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-navy shadow-[0_8px_24px_-12px_rgba(18,35,46,0.5)] ring-1 ring-navy/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5">
            <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-navy/[0.07] sm:p-7">
              <p className="eyebrow">Find us</p>
              <p className="mt-4 font-serif-luxury text-[1.45rem] leading-snug text-navy sm:text-2xl">{address}</p>
              {coords && <p className="mt-2 font-mono text-xs text-ocean">{coords}</p>}
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
                <a href={mapsDirectionsUrl(l.mapLat, l.mapLng)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <Navigation />
                  Get directions
                </a>
                <a href={mapsOpenUrl(l)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  Open in Google Maps
                  <ArrowUpRight />
                </a>
              </div>
            </div>

            {l.highlights.length > 0 && (
              <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-navy/[0.07] sm:p-7">
                <h3 className="font-serif-luxury text-2xl text-navy">Nearby</h3>
                <ul className="mt-3 divide-y divide-navy/[0.07]">
                  {l.highlights.map((p, i) => (
                    <li key={i} className="flex items-start justify-between gap-4 py-3.5">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-navy">{p.name}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-ocean">{p.desc}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-serif-luxury text-lg leading-none text-navy">{p.distance}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ocean">{p.type}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-start gap-4 rounded-[1.75rem] bg-navy p-6 text-sand sm:p-7">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ring-white/15">
                <Plane className="h-4 w-4 text-terracotta" strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-sm font-medium">Airport transfers</p>
                <p className="mt-1 text-xs leading-relaxed text-sand/65">{l.airportNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
