"use client";

import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, Sparkles, Star } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { BaiaLogo } from "./BaiaLogo";

interface HeroProps {
  heroData: SiteConfig["hero"];
  brand: SiteConfig["brand"];
  onOpenBookingWithParams: (dates: { checkIn: string; checkOut: string; guests: number }) => void;
}

const FALLBACK = {
  type: "image" as const,
  url: "https://images.pexels.com/photos/36758179/pexels-photo-36758179.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2200",
  caption: "Sitio Panindigan, Palawan",
};

function localIso(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
function shift(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return localIso(d);
}
function pretty(iso: string) {
  return iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
}
/** Portrait crop for phones when the image comes from Pexels (sharper and lighter). */
function pexelsCrop(url: string, w: number, h: number): string | null {
  if (!url.startsWith("https://images.pexels.com/")) return null;
  try {
    const u = new URL(url);
    u.searchParams.set("auto", "compress");
    u.searchParams.set("cs", "tinysrgb");
    u.searchParams.set("fit", "crop");
    u.searchParams.set("w", String(w));
    u.searchParams.set("h", String(h));
    return u.toString();
  } catch {
    return null;
  }
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col justify-center rounded-[1.1rem] bg-white/[0.07] px-4 py-2.5 ring-1 ring-inset ring-white/10 transition focus-within:ring-white/40 hover:bg-white/[0.11]">
      <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-white/60">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "mt-0.5 w-full min-w-0 appearance-none bg-transparent text-left text-sm font-medium text-white outline-none [color-scheme:dark]";

export function HeroSection({ heroData, brand, onOpenBookingWithParams }: HeroProps) {
  const media = heroData.backgroundMedia.length ? heroData.backgroundMedia : [FALLBACK];
  const [active, setActive] = useState(0);
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const t = localIso(new Date());
    setToday(t);
    setCheckIn(shift(t, 14));
    setCheckOut(shift(t, 18));
  }, []);

  useEffect(() => {
    if (media.length < 2) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % media.length), 7000);
    return () => clearInterval(timer);
  }, [media.length]);

  const index = active % media.length;
  const showEmblem = brand.showHeroEmblem && brand.logoMode === "vector";

  const onCheckIn = (value: string) => {
    setCheckIn(value);
    if (value && (!checkOut || checkOut <= value)) setCheckOut(shift(value, 3));
  };
  const book = () => onOpenBookingWithParams({ checkIn, checkOut, guests });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    book();
  };

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {media.map((m, i) => {
          const portrait = m.type === "image" ? pexelsCrop(m.url, 900, 1600) : null;
          return (
            <div key={`${m.url}-${i}`} className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${i === index ? "opacity-100" : "opacity-0"}`}>
              {m.type === "video" ? (
                <video src={m.url} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
              ) : (
                <picture>
                  {portrait && <source media="(max-width: 767px)" srcSet={portrait} />}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.url}
                    alt=""
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    className={`h-full w-full object-cover ${i === index ? "kenburns" : ""}`}
                  />
                </picture>
              )}
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/15 to-navy/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_65%,transparent_15%,rgba(0,0,0,0.35)_100%)]" />
      </div>

      <div className="container-x flex flex-1 flex-col justify-end pb-6 pt-28 sm:pb-8 md:justify-center md:pb-10 md:pt-40">
        <div className="max-w-3xl">
          {showEmblem && (
            <div className="animate-rise mb-6" aria-hidden="true">
              <BaiaLogo layout="mark" tone="light" brand={brand} animate className="h-12 sm:h-16" />
            </div>
          )}
          <p className="eyebrow animate-rise text-white/85" style={{ animationDelay: "120ms" }}>
            {heroData.tagline}
          </p>
          <h1
            className="animate-rise mt-4 font-serif-luxury text-[2.6rem] font-light leading-[1.02] tracking-[-0.015em] sm:mt-5 sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
            style={{ animationDelay: "220ms" }}
          >
            {heroData.titleLine1}
            <span className="block italic text-driftwood">{heroData.titleLine2}</span>
          </h1>
          <p className="animate-rise mt-4 max-w-xl text-[15px] font-light leading-relaxed text-white/80 sm:mt-5 sm:text-lg" style={{ animationDelay: "340ms" }}>
            {heroData.subtitle}
          </p>
          <div className="animate-rise mt-6 flex flex-wrap items-center gap-2.5 sm:mt-7" style={{ animationDelay: "460ms" }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs ring-1 ring-white/20 backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-terracotta text-terracotta" />
              <b className="font-semibold">{heroData.ratingScore}</b> Wonderful
              <span className="text-white/35">·</span>
              {heroData.locationScore} location
            </span>
            {heroData.showDirectBookingPerks && heroData.directBookingPerksText && (
              <span className="hidden items-center gap-2 text-xs text-white/75 lg:inline-flex">
                <Sparkles className="h-3.5 w-3.5 text-driftwood" />
                {heroData.directBookingPerksText}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container-x pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-10">
        {/* Phones: one clean booking pill (opens the full booking sheet) */}
        <button
          type="button"
          onClick={book}
          className="glass-panel animate-rise flex w-full items-center gap-3 rounded-full p-1.5 pl-5 text-left md:hidden"
          style={{ animationDelay: "560ms" }}
        >
          <CalendarDays className="h-[18px] w-[18px] shrink-0 text-white/80" strokeWidth={1.6} />
          <span className="min-w-0 flex-1">
            <span className="block text-[9.5px] font-semibold uppercase tracking-[0.22em] text-white/60">{heroData.ctaBookingText}</span>
            <span className="mt-0.5 block truncate text-sm text-white">
              {checkIn ? `${pretty(checkIn)} – ${pretty(checkOut)}` : "Select your dates"} · {guests} guests
            </span>
          </span>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-navy">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </button>

        {/* Tablet & desktop: inline booking bar */}
        <form
          onSubmit={submit}
          aria-label="Check availability"
          className="glass-panel animate-rise hidden grid-cols-[1fr_1fr_0.85fr_auto] gap-2 rounded-[1.5rem] p-2 md:grid"
          style={{ animationDelay: "560ms" }}
        >
          <Field label="Check-in">
            <input type="date" required value={checkIn} min={today || undefined} onChange={(e) => onCheckIn(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Check-out">
            <input type="date" required value={checkOut} min={checkIn ? shift(checkIn, 1) : undefined} onChange={(e) => setCheckOut(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Guests">
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={`${inputCls} [&>option]:text-navy`}>
              <option value={1}>1 guest</option>
              <option value={2}>2 guests</option>
              <option value={3}>3 guests</option>
              <option value={4}>4 guests</option>
            </select>
          </Field>
          <button type="submit" className="btn btn-light min-h-[3.4rem] rounded-[1.1rem] px-7 tracking-[0.16em]">
            {heroData.ctaBookingText}
            <ArrowUpRight />
          </button>
        </form>

        <div className="mt-4 hidden items-center justify-between text-[11px] text-white/60 md:flex">
          {media.length > 1 ? (
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                {media.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show slide ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-white" : "w-3 bg-white/35 hover:bg-white/60"}`}
                  />
                ))}
              </div>
              <span>{media[index]?.caption}</span>
            </div>
          ) : (
            <span />
          )}
          <a href="#about" className="inline-flex items-center gap-1.5 uppercase tracking-[0.25em] transition hover:text-white">
            Discover
            <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
