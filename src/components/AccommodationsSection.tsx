"use client";

import { ArrowUpRight, BedDouble, Expand, Maximize2, Star, Users } from "lucide-react";
import type { RoomConfig, SiteConfig } from "@/lib/siteConfig";
import { SectionHeading } from "./SectionHeading";

interface AccommodationsProps {
  accommodationsData: SiteConfig["accommodations"];
  onSelectRoom: (room: RoomConfig) => void;
  onBookNow: (room: RoomConfig) => void;
}

export function AccommodationsSection({ accommodationsData, onSelectRoom, onBookNow }: AccommodationsProps) {
  const rooms = accommodationsData.rooms;
  return (
    <section id="accommodations" className="section-y bg-shell">
      <div className="container-x">
        <SectionHeading eyebrow={accommodationsData.badge} title={accommodationsData.title} subtitle={accommodationsData.subtitle} />

        {/* Phones: stacked · Tablets: wide cards · Desktop: three columns */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:gap-6 lg:grid-cols-3">
          {rooms.map((room) => (
            <article
              key={room.id}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-navy/[0.07] transition-shadow duration-500 hover:shadow-[0_30px_60px_-40px_rgba(18,35,46,0.55)] md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:flex lg:flex-col"
            >
              <button
                type="button"
                onClick={() => onSelectRoom(room)}
                aria-label={`View photos of ${room.name}`}
                className="relative block aspect-[4/3] overflow-hidden bg-navy/5 md:aspect-auto md:min-h-[22rem] lg:aspect-[4/3] lg:min-h-0"
              >
                {room.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                {room.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white ring-1 ring-white/30 backdrop-blur-md">
                    {room.tag}
                  </span>
                )}
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-navy">
                  <Star className="h-3 w-3 fill-terracotta text-terracotta" />
                  {room.rating}
                </span>
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90">
                  <Expand className="h-3 w-3" />
                  {room.images.length} photos
                </span>
              </button>

              <div className="flex flex-1 flex-col p-5 sm:p-7 lg:p-6">
                <h3 className="font-serif-luxury text-[1.65rem] font-light leading-tight text-navy sm:text-[1.85rem] lg:text-[1.65rem]">{room.name}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ocean">{room.subtitle}</p>
                <p className="mt-3 hidden text-sm font-light leading-relaxed text-ocean md:line-clamp-4 lg:hidden">{room.description}</p>

                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-navy/70">
                  <li className="inline-flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5 text-terracotta" strokeWidth={1.6} />
                    {room.sqm} m²
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-terracotta" strokeWidth={1.6} />
                    {room.occupancy}
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <BedDouble className="h-3.5 w-3.5 text-terracotta" strokeWidth={1.6} />
                    {room.bed.split("+")[0].trim()}
                  </li>
                </ul>

                <div className="mt-auto pt-6">
                  <div className="flex flex-wrap items-end justify-between gap-3 border-t border-navy/[0.08] pt-5">
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.22em] text-ocean">From</span>
                      <span className="font-serif-luxury text-[1.75rem] leading-none text-navy">${room.pricePerNight}</span>
                      <span className="text-xs text-ocean"> / night</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectRoom(room)}
                        aria-label={`Details for ${room.name}`}
                        className="btn btn-sm btn-icon btn-outline lg:hidden xl:inline-flex"
                      >
                        <Expand />
                      </button>
                      <button type="button" onClick={() => onBookNow(room)} className="btn btn-sm btn-outline">
                        Reserve
                        <ArrowUpRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
