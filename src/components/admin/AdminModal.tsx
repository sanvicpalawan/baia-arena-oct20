"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import {
  Bed, CalendarCheck, CheckCircle2, Compass, Eye, Globe, HelpCircle, Image as ImageIcon, KeyRound, Layout, Loader2, LogOut,
  MapPin, Palette, PenTool, RotateCcw, Save, Share2, Sparkles, Star, Type, UtensilsCrossed, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { inputCls } from "./fields";
import type { Setter, TabProps } from "./fields";
import { BookingsDesk } from "./BookingsDesk";
import { BrandTab, ColorsTab, TypographyTab } from "./tabs/DesignTabs";
import { AboutTab, DiningTab, ExperiencesTab, FaqTab, HeaderTab, HeroTab, ReviewsTab, RoomsTab } from "./tabs/ContentTabs";
import { LocationTab } from "./tabs/LocationTab";
import { FooterTab, OtaTab } from "./tabs/ChannelTabs";
import { SecurityTab } from "./tabs/SecurityTab";

type EditorTab = "brand" | "typography" | "colors" | "header" | "hero" | "about" | "rooms" | "ota" | "dining" | "experiences" | "faq" | "reviews" | "location" | "footer";
type TabId = "bookings" | "security" | EditorTab;

const NAV: { group: string; items: { id: TabId; label: string; icon: LucideIcon }[] }[] = [
  { group: "Front desk", items: [{ id: "bookings", label: "Booking Agent Desk", icon: CalendarCheck }] },
  {
    group: "Brand & design",
    items: [
      { id: "brand", label: "Logo & Brand", icon: PenTool },
      { id: "typography", label: "Typography", icon: Type },
      { id: "colors", label: "Colour Palette", icon: Palette },
    ],
  },
  {
    group: "Page sections",
    items: [
      { id: "header", label: "Header & Menu", icon: Layout },
      { id: "hero", label: "Hero & Media", icon: ImageIcon },
      { id: "about", label: "About BAIA", icon: Sparkles },
      { id: "rooms", label: "Cottages & Rooms", icon: Bed },
      { id: "ota", label: "Book Direct & OTAs", icon: Globe },
      { id: "dining", label: "Dining & Menus", icon: UtensilsCrossed },
      { id: "experiences", label: "Experiences", icon: Compass },
      { id: "faq", label: "FAQ", icon: HelpCircle },
      { id: "reviews", label: "Guest Reviews", icon: Star },
      { id: "location", label: "Location & Map", icon: MapPin },
      { id: "footer", label: "Footer, Social & Legal", icon: Share2 },
    ],
  },
  { group: "Account", items: [{ id: "security", label: "Security & Passkey", icon: KeyRound }] },
];

const EDITORS: Record<EditorTab, (p: TabProps) => ReactElement | null> = {
  brand: BrandTab,
  typography: TypographyTab,
  colors: ColorsTab,
  header: HeaderTab,
  hero: HeroTab,
  about: AboutTab,
  rooms: RoomsTab,
  ota: OtaTab,
  dining: DiningTab,
  experiences: ExperiencesTab,
  faq: FaqTab,
  reviews: ReviewsTab,
  location: LocationTab,
  footer: FooterTab,
};

interface AdminModalProps {
  draft: SiteConfig;
  set: Setter;
  dirty: boolean;
  hidden: boolean;
  passkey: string;
  publishing: boolean;
  onPublish: () => Promise<{ ok: boolean; error?: string }>;
  onPreview: () => void;
  onDiscard: () => void;
  onRestoreDefaults: () => void;
  onClose: () => void;
  onLogout: () => void;
  onPasskeyChanged: (key: string) => void;
}

export function AdminModal({
  draft, set, dirty, hidden, passkey, publishing, onPublish, onPreview, onDiscard, onRestoreDefaults, onClose, onLogout, onPasskeyChanged,
}: AdminModalProps) {
  const [tab, setTab] = useState<TabId>("brand");
  const [status, setStatus] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [bookingCount, setBookingCount] = useState<number | null>(null);

  const requestClose = () => {
    if (dirty && !window.confirm("Close the editor? Your unpublished changes will be discarded.")) return;
    onClose();
  };

  useEffect(() => {
    if (hidden) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [hidden]);

  const publish = async () => {
    setStatus(null);
    const result = await onPublish();
    setStatus(result.ok ? { type: "ok", text: "Published to the live site" } : { type: "error", text: result.error ?? "Could not publish" });
    if (result.ok) window.setTimeout(() => setStatus(null), 3500);
  };

  const Editor = tab === "bookings" || tab === "security" ? null : EDITORS[tab];

  return (
    <div role="dialog" aria-modal="true" aria-label="BAIA admin" className={`fixed inset-0 z-[60] items-stretch justify-center bg-black/70 backdrop-blur-sm sm:p-4 ${hidden ? "hidden" : "flex"}`}>
      <div className="animate-fade-in flex h-full w-full max-w-[1440px] flex-col overflow-hidden bg-[#F6F4EF] text-[#12232E] shadow-2xl sm:rounded-3xl">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 bg-[#12232E] px-3 py-3 text-white sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-serif-luxury text-lg sm:text-xl">BAIA Admin</h2>
              <span className="hidden rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 sm:inline">Signed in</span>
            </div>
            <p className="hidden text-[11px] text-white/55 md:block">Edit anything — preview it on the real site — then publish.</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {status && (
              <span className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs lg:inline-flex ${status.type === "ok" ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>
                {status.type === "ok" && <CheckCircle2 className="h-4 w-4" />}
                {status.text}
              </span>
            )}
            <button type="button" onClick={onPreview} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              type="button"
              onClick={() => void publish()}
              disabled={publishing || !dirty}
              className="btn-terracotta inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
            >
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Publish
            </button>
            <button type="button" onClick={onLogout} title="Sign out" aria-label="Sign out" className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
            <button type="button" onClick={requestClose} aria-label="Close admin" className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile section picker */}
        <div className="border-b border-[#12232E]/10 bg-white p-3 md:hidden">
          <select value={tab} onChange={(e) => setTab(e.target.value as TabId)} className={inputCls} aria-label="Admin section">
            {NAV.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {status && <p className={`mt-2 text-xs ${status.type === "ok" ? "text-emerald-700" : "text-rose-600"}`}>{status.text}</p>}
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-[#12232E]/10 bg-white p-4 md:flex">
            <nav className="space-y-5" aria-label="Admin sections">
              {NAV.map((g) => (
                <div key={g.group}>
                  <span className="mb-1.5 block px-3 text-[10px] font-bold uppercase tracking-widest text-[#4F6D7A]">{g.group}</span>
                  {g.items.map((item) => {
                    const active = tab === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTab(item.id)}
                        className={`mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${active ? "bg-[#12232E] text-white" : "text-[#12232E]/80 hover:bg-[#FBF9F5]"}`}
                      >
                        <Icon className="h-4 w-4 text-[#C87D55]" />
                        <span>{item.label}</span>
                        {item.id === "bookings" && bookingCount !== null && (
                          <span className="ml-auto rounded-full bg-[#C87D55] px-1.5 py-0.5 text-[10px] font-bold text-white">{bookingCount}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Restore every setting to the original BAIA defaults? Nothing changes on the live site until you publish.")) onRestoreDefaults();
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restore defaults
            </button>
          </aside>

          <main className="relative min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl p-4 pb-28 sm:p-8 sm:pb-28">
              {tab === "bookings" && <BookingsDesk passkey={passkey} rooms={draft.accommodations.rooms} onCountChange={setBookingCount} />}
              {tab === "security" && <SecurityTab passkey={passkey} onChanged={onPasskeyChanged} />}
              {Editor && <Editor data={draft} set={set} passkey={passkey} />}
            </div>

            {dirty && (
              <div className="sticky bottom-0 z-10 border-t border-[#12232E]/10 bg-white/95 px-4 py-3 backdrop-blur sm:px-8">
                <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-xs font-medium text-[#12232E]">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    You have unpublished changes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Discard all unpublished changes?")) onDiscard();
                      }}
                      className="rounded-xl px-3 py-2 text-xs font-semibold text-[#12232E]/70 transition hover:bg-[#12232E]/5"
                    >
                      Discard
                    </button>
                    <button type="button" onClick={onPreview} className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#12232E] ring-1 ring-[#12232E]/15 transition hover:bg-[#12232E]/5">
                      <Eye className="h-3.5 w-3.5" /> Preview on site
                    </button>
                    <button
                      type="button"
                      onClick={() => void publish()}
                      disabled={publishing}
                      className="btn-terracotta inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-60"
                    >
                      {publishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
