"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, ArrowUp, Loader2, Lock, Mail, MapPin, Phone } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { socialInfo } from "@/lib/platforms";
import { BaiaLogo } from "./BaiaLogo";
import { BrandIcon } from "./BrandIcon";

interface FooterProps {
  footerData: SiteConfig["footer"];
  brand: SiteConfig["brand"];
  navLinks: SiteConfig["header"]["navLinks"];
  legal: SiteConfig["legal"];
  mapsUrl: string;
  onOpenAdmin: () => void;
}

const titleCls = "text-[11px] font-semibold uppercase tracking-[0.28em] text-sand";
const linkCls = "transition-colors duration-300 hover:text-white";

export function Footer({ footerData: f, brand, navLinks, legal, mapsUrl, onOpenAdmin }: FooterProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const socials = f.socials.filter((s) => s.active && s.url.trim());
  const tel = f.phone.replace(/[^\d+]/g, "");

  const subscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || state === "sending") return;
    setState("sending");
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Newsletter subscriber", email, subject: "Newsletter", message: "Please add me to the BAIA newsletter." }),
      });
    } catch {
      /* non-blocking */
    }
    setEmail("");
    setState("done");
  };

  return (
    <footer className="bg-navy text-sand">
      <div className="container-x pt-16 sm:pt-20 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <a href="#top" aria-label="BAIA Palawan — back to top" className="inline-block">
              <BaiaLogo layout="stacked" tone="light" brand={brand} textured width={brand.footerLogoWidth} className="max-w-[60vw]" label="BAIA Palawan" />
            </a>
            <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-sand/65">{f.brandDescription}</p>
            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
                {socials.map((s) => {
                  const info = socialInfo(s.platform);
                  return (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target={s.platform === "email" ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        aria-label={info.label}
                        title={info.label}
                        className="grid h-10 w-10 place-items-center rounded-full text-sand/75 ring-1 ring-white/15 transition-all duration-300 hover:bg-white hover:text-navy hover:ring-white"
                      >
                        <BrandIcon glyph={info.glyph} className="h-4 w-4" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 lg:col-span-8 lg:gap-10">
            <div>
              <h2 className={titleCls}>Explore</h2>
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-light text-sand/65 sm:grid-cols-1">
                {navLinks.map((link) => (
                  <li key={`${link.name}-${link.href}-f`}>
                    <a href={link.href} className={linkCls}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className={titleCls}>Contact</h2>
              <ul className="mt-5 space-y-4 text-sm font-light text-sand/65">
                <li>
                  <a href={`tel:${tel}`} className={`flex items-start gap-3 ${linkCls}`}>
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sand/40" strokeWidth={1.5} />
                    <span>{f.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${f.email}`} className={`flex items-start gap-3 ${linkCls}`}>
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sand/40" strokeWidth={1.5} />
                    <span className="[overflow-wrap:anywhere]">{f.email}</span>
                  </a>
                </li>
                <li>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={`flex items-start gap-3 ${linkCls}`}>
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sand/40" strokeWidth={1.5} />
                    <span>{f.address}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              {f.showNewsletter && (
                <>
                  <h2 className={titleCls}>{f.newsletterTitle}</h2>
                  <p className="mt-5 text-sm font-light leading-relaxed text-sand/65">{f.newsletterText}</p>
                  <form onSubmit={subscribe} className="mt-5 flex items-center gap-1 rounded-full p-1 ring-1 ring-white/15 transition focus-within:ring-white/40">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (state === "done") setState("idle");
                      }}
                      placeholder="Email address"
                      aria-label="Email address"
                      className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-sand/40"
                    />
                    <button type="submit" aria-label="Subscribe" className="btn btn-sm btn-icon btn-glass shrink-0">
                      {state === "sending" ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                    </button>
                  </form>
                  {state === "done" && <p className="mt-2 text-xs text-sage">Thank you — you&apos;re on the list.</p>}
                </>
              )}
              {f.accreditationText && <p className="mt-6 text-xs text-sand/45">{f.accreditationText}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-14 border-t border-white/10 sm:mt-16">
        <div className="container-x flex flex-col gap-4 pb-24 pt-6 text-xs text-sand/50 md:flex-row md:items-center md:justify-between md:pb-6">
          <p>
            © {new Date().getFullYear()} {f.copyrightText}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="/legal/privacy" className={linkCls}>
              {legal.privacyTitle}
            </a>
            <a href="/legal/terms" className={linkCls}>
              {legal.termsTitle}
            </a>
            {f.showAdminLink && (
              <button type="button" onClick={onOpenAdmin} className={`inline-flex items-center gap-1.5 ${linkCls}`}>
                <Lock className="h-3 w-3" />
                Admin
              </button>
            )}
            <a href="#top" className={`inline-flex items-center gap-1.5 ${linkCls}`}>
              Back to top
              <ArrowUp className="h-3 w-3" />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
