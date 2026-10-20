"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import type { RoomConfig } from "@/lib/siteConfig";

interface RoomDetailsModalProps {
  room: RoomConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToBooking: (room: RoomConfig) => void;
}

export function RoomDetailsModal({ room, isOpen, onClose, onProceedToBooking }: RoomDetailsModalProps) {
  const [index, setIndex] = useState(0);
  const total = room?.images.length ?? 0;

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && total > 1) setIndex((i) => (i + 1) % total);
      if (e.key === "ArrowLeft" && total > 1) setIndex((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, total]);

  if (!isOpen || !room) return null;
  const images = room.images.length ? room.images : [""];
  const go = (dir: number) => setIndex((i) => (i + dir + images.length) % images.length);
  const specs: [string, string][] = [
    ["Space", `${room.sqm} m²`],
    ["Guests", room.occupancy],
    ["Bed", room.bed],
    ["View", room.view],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={room.name}
        onClick={(e) => e.stopPropagation()}
        className="animate-sheet relative flex max-h-[94svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[1.75rem] bg-sand text-navy shadow-2xl sm:rounded-[1.75rem]"
      >
        <button type="button" onClick={onClose} aria-label="Close" className="btn btn-sm btn-icon btn-glass absolute right-4 top-4 z-10">
          <X />
        </button>

        <div className="overflow-y-auto">
          <div className="relative aspect-[4/3] bg-navy sm:aspect-[16/9]">
            {images[index] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[index]} alt={room.name} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="btn btn-sm btn-icon btn-glass absolute left-4 top-1/2 -translate-y-1/2">
                  <ChevronLeft />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next photo" className="btn btn-sm btn-icon btn-glass absolute right-4 top-1/2 -translate-y-1/2">
                  <ChevronRight />
                </button>
                <span className="absolute bottom-4 left-4 rounded-full bg-black/35 px-3 py-1 text-[11px] text-white backdrop-blur">
                  {index + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex flex-wrap gap-2 px-5 pt-4 sm:px-8">
              {images.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Photo ${i + 1}`}
                  className={`h-14 w-20 overflow-hidden rounded-xl ring-2 transition ${i === index ? "ring-navy" : "opacity-70 ring-transparent hover:opacity-100"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                {room.tag && <p className="eyebrow">{room.tag}</p>}
                <h2 className="mt-3 font-serif-luxury text-[2rem] font-light leading-tight sm:text-4xl">{room.name}</h2>
                <p className="mt-2 text-sm text-ocean">{room.subtitle}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-navy/10">
                <Star className="h-3.5 w-3.5 fill-terracotta text-terracotta" />
                {room.rating}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-white p-3.5 ring-1 ring-navy/[0.06]">
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-ocean">{k}</dt>
                  <dd className="mt-1 text-[13px] font-medium leading-snug">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="lead mt-6">{room.description}</p>

            {room.amenities.length > 0 && (
              <>
                <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.25em]">Amenities &amp; privileges</h3>
                <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {room.amenities.map((a, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-navy/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" strokeWidth={1.8} />
                      {a}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-navy/[0.08] bg-white/80 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:px-8 sm:pb-4">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-ocean">From</span>
            <span className="font-serif-luxury text-2xl">${room.pricePerNight}</span>
            <span className="text-xs text-ocean"> / night</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onProceedToBooking(room);
            }}
            className="btn btn-primary"
          >
            Reserve
            <ArrowUpRight />
          </button>
        </div>
      </div>
    </div>
  );
}
