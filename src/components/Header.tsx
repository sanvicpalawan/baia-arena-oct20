"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { socialInfo } from "@/lib/platforms";
import { BaiaLogo } from "./BaiaLogo";
import { BrandIcon } from "./BrandIcon";

interface HeaderProps {
  headerData: SiteConfig["header"];
  brand: SiteConfig["brand"];
  footerData: SiteConfig["footer"];
  isScrolledPastHero: boolean;
  onOpenBooking: () => void;
  onLogoTripleClick?: () => void;
}

export function Header({ headerData, brand, footerData, isScrolledPastHero, onOpenBooking, onLogoTripleClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const solid = scrolled || brand.headerStyle === "solid";
  const ghost = solid ? "btn-outline" : "btn-glass";
  const label = `${headerData.logoTitle || "BAIA"} — ${headerData.logoSubtitle || "Palawan"}`;
  const logoVars = (shrink: boolean) =>
    ({
      "--logo-h": `${brand.headerLogoHeight}px`,
      "--logo-hm": `${brand.headerLogoHeightMobile}px`,
      "--logo-s": shrink ? "0.82" : "1",
    }) as CSSProperties;
  const socials = footerData.socials.filter((s) => s.active && s.url.trim()).slice(0, 5);
  const tel = footerData.phone.replace(/[^\d+]/g, "");

  const goTop = (e: ReactMouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Triple-click the logo to open the admin passkey modal.
  const handleLogoClick = (e: ReactMouseEvent) => {
    e.preventDefault();
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    if (clicks.current >= 3) {
      clicks.current = 0;
      setMenuOpen(false);
      onLogoTripleClick?.();
      return;
    }
    if (clicks.current === 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    timer.current = setTimeout(() => {
      clicks.current = 0;
    }, 900);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
          solid ? "glass-header shadow-[0_12px_32px_-26px_rgba(18,35,46,0.55)]" : "bg-gradient-to-b from-black/50 via-black/15 to-transparent"
        }`}
      >
        <div
          className={`container-x grid grid-cols-[1fr_auto_1fr] items-center gap-3 transition-[padding] duration-500 xl:flex xl:justify-between xl:gap-8 ${
            scrolled ? "py-2" : "py-3 sm:py-4"
          }`}
        >
          <div className="flex items-center xl:hidden">
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className={`btn btn-sm btn-icon ${ghost}`}>
              <Menu />
            </button>
          </div>

          <a href="#top" onClick={handleLogoClick} aria-label={label} className="block justify-self-center xl:shrink-0" style={logoVars(scrolled)}>
            <BaiaLogo
              layout={brand.headerLogoVariant}
              tone={solid ? "dark" : "light"}
              brand={brand}
              textured={false}
              label={label}
              className="h-[calc(var(--logo-hm)*var(--logo-s))] transition-[height] duration-500 md:h-[calc(var(--logo-h)*var(--logo-s))]"
            />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-7 xl:flex">
            {headerData.navLinks.map((link) => (
              <a
                key={`${link.name}-${link.href}`}
                href={link.href}
                className={`group relative py-2 text-[13px] font-medium tracking-[0.04em] transition-colors duration-300 ${
                  solid ? "text-navy/70 hover:text-navy" : "text-white/85 hover:text-white"
                }`}
              >
                {link.name}
                <span className="absolute inset-x-0 bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            {isScrolledPastHero && headerData.showCottageBadge && (
              <span className="animate-fade-in hidden items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium text-navy/70 ring-1 ring-navy/10 2xl:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {headerData.cottageBadgeText}
              </span>
            )}
            <button type="button" onClick={onOpenBooking} className={`btn btn-sm ${ghost}`}>
              <span className="sm:hidden">Book</span>
              <span className="hidden sm:inline">{headerData.ctaText}</span>
              <ArrowUpRight className="hidden sm:block" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-navy text-sand xl:hidden">
          <div className="container-x grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 sm:py-4" style={logoVars(false)}>
            <div className="flex items-center">
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="btn btn-sm btn-icon btn-glass">
                <X />
              </button>
            </div>
            <a href="#top" onClick={goTop} aria-label={label} className="block justify-self-center">
              <BaiaLogo layout={brand.headerLogoVariant} tone="light" brand={brand} textured={false} label={label} className="h-[var(--logo-hm)] md:h-[var(--logo-h)]" />
            </a>
            <span aria-hidden="true" />
          </div>

          <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto py-6">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {headerData.navLinks.map((link, i) => (
                <li key={`${link.name}-${link.href}-m`} className="animate-rise" style={{ animationDelay: `${60 + i * 45}ms` }}>
                  <a href={link.href} onClick={() => setMenuOpen(false)} className="group flex items-baseline justify-between gap-4 py-4">
                    <span className="font-serif-luxury text-[1.85rem] font-light leading-none transition-colors group-hover:text-driftwood sm:text-4xl">{link.name}</span>
                    <span className="text-[10px] tracking-[0.3em] text-sand/35">{String(i + 1).padStart(2, "0")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="container-x space-y-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenBooking();
              }}
              className="btn btn-light btn-lg btn-block"
            >
              {headerData.ctaText}
              <ArrowUpRight />
            </button>
            <div className="flex flex-wrap items-end justify-between gap-4 text-xs text-sand/60">
              <div className="flex flex-col gap-2">
                <a href={`tel:${tel}`} className="inline-flex items-center gap-2 hover:text-white">
                  <Phone className="h-3.5 w-3.5" strokeWidth={1.6} />
                  {footerData.phone}
                </a>
                <a href={`mailto:${footerData.email}`} className="inline-flex items-center gap-2 hover:text-white">
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.6} />
                  {footerData.email}
                </a>
              </div>
              {socials.length > 0 && (
                <div className="flex gap-2">
                  {socials.map((s) => {
                    const info = socialInfo(s.platform);
                    return (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={info.label}
                        className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/15 transition hover:bg-white hover:text-navy"
                      >
                        <BrandIcon glyph={info.glyph} className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
