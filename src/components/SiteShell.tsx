"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Eye, Loader2, PenLine } from "lucide-react";
import type { SiteConfig, RoomConfig } from "@/lib/siteConfig";
import { DEFAULT_SITE_CONFIG } from "@/lib/siteConfig";
import { mapsOpenUrl } from "@/lib/maps";
import type { Setter } from "./admin/fields";
import { ThemeStyles } from "./ThemeStyles";
import { CustomCursor } from "./CustomCursor";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { AccommodationsSection } from "./AccommodationsSection";
import { OtaSection } from "./OtaSection";
import { DiningSection } from "./DiningSection";
import { ExperiencesSection } from "./ExperiencesSection";
import { FaqSection } from "./FaqSection";
import { ReviewsSection } from "./ReviewsSection";
import { LocationSection } from "./LocationSection";
import { Footer } from "./Footer";
import { ChatbotWidget } from "./ChatbotWidget";
import { RoomDetailsModal } from "./RoomDetailsModal";
import { BookingModal } from "./BookingModal";
import { PasskeyModal } from "./admin/PasskeyModal";
import { AdminModal } from "./admin/AdminModal";

type BookingDates = { checkIn: string; checkOut: string; guests: number };
type AdminView = "closed" | "editor" | "preview";
type PublishResult = { ok: boolean; error?: string };

const ADMIN_KEY_STORAGE = "baia_admin_key";

async function passkeyIsValid(key: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ passkey: key }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function SiteShell({ initialConfig }: { initialConfig: SiteConfig }) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const configRef = useRef(initialConfig);
  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [adminView, setAdminView] = useState<AdminView>("closed");
  const [passkeyOpen, setPasskeyOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [selectedRoom, setSelectedRoom] = useState<RoomConfig | null>(null);
  const [booking, setBooking] = useState<{ open: boolean; key: number; room: { id: string } | null; dates: BookingDates | null }>({
    open: false,
    key: 0,
    room: null,
    dates: null,
  });
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [chatReady, setChatReady] = useState(false);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      setScrolledPastHero(y > h * 0.75);
      setChatReady(y > h * 0.55);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const view = adminView === "preview" && draft ? draft : config;
  const dirty = useMemo(() => draft !== null && JSON.stringify(draft) !== JSON.stringify(config), [draft, config]);
  const activeRooms = useMemo(() => view.accommodations.rooms.filter((r) => r.active), [view.accommodations.rooms]);
  const fromPrice = activeRooms.length ? Math.min(...activeRooms.map((r) => r.pricePerNight)) : 0;

  const openBooking = useCallback((room?: { id: string } | null, dates?: BookingDates | null) => {
    setBooking((b) => ({ open: true, key: b.key + 1, room: room ?? null, dates: dates ?? null }));
  }, []);
  const closeBooking = useCallback(() => setBooking((b) => ({ ...b, open: false })), []);
  const closeRoom = useCallback(() => setSelectedRoom(null), []);
  const openChat = useCallback(() => window.dispatchEvent(new Event("baia:open-chat")), []);

  /* ---------------------------- Admin ---------------------------- */
  const startAdmin = useCallback((key: string) => {
    setAdminKey(key);
    setDraft((d) => d ?? structuredClone(configRef.current));
    setAdminView("editor");
  }, []);

  const openAdmin = useCallback(async () => {
    const stored = window.sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) {
      if (await passkeyIsValid(stored)) {
        startAdmin(stored);
        return;
      }
      window.sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    }
    setPasskeyOpen(true);
  }, [startAdmin]);

  // yoursite.com/#admin opens the admin too
  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash.toLowerCase() === "#admin") {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        void openAdmin();
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [openAdmin]);

  const setDraftMutable: Setter = useCallback((mutate) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      mutate(next);
      return next;
    });
  }, []);

  const publish = useCallback(async (): Promise<PublishResult> => {
    if (!draft || !adminKey) return { ok: false, error: "Please sign in again." };
    setPublishing(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passkey": adminKey },
        body: JSON.stringify({ config: draft }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) return { ok: false, error: "Your admin session has expired — please sign out and sign in again." };
      if (!res.ok || !data.success) return { ok: false, error: data.error || "Could not publish changes." };
      const saved = data.config as SiteConfig;
      setConfig(saved);
      setDraft(structuredClone(saved));
      return { ok: true };
    } catch {
      return { ok: false, error: "Connection problem — please try again." };
    } finally {
      setPublishing(false);
    }
  }, [draft, adminKey]);

  const publishFromPreview = async () => {
    const result = await publish();
    setNotice(result.ok ? "Published to the live site" : result.error ?? "Could not publish");
    window.setTimeout(() => setNotice(null), 3500);
  };

  const closeAdmin = useCallback(() => {
    setAdminView("closed");
    setDraft(null);
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey(null);
    setAdminView("closed");
    setDraft(null);
  }, []);

  return (
    <main className="relative min-h-screen bg-sand text-navy">
      <ThemeStyles theme={view.theme} />
      <CustomCursor />

      <Header headerData={view.header} brand={view.brand} footerData={view.footer} isScrolledPastHero={scrolledPastHero} onOpenBooking={() => openBooking()} onLogoTripleClick={() => setPasskeyOpen(true)} />
      <HeroSection heroData={view.hero} brand={view.brand} onOpenBookingWithParams={(dates) => openBooking(null, dates)} />
      <AboutSection aboutData={view.about} />
      <AccommodationsSection
        accommodationsData={{ ...view.accommodations, rooms: activeRooms }}
        onSelectRoom={setSelectedRoom}
        onBookNow={(room) => openBooking(room)}
      />
      <OtaSection otaData={view.otaLinks} fromPrice={fromPrice} onDirectBook={() => openBooking()} onAskHost={openChat} />
      <DiningSection diningData={view.dining} onOpenBooking={() => openBooking()} />
      <ExperiencesSection experiencesData={view.experiences} onOpenBooking={() => openBooking()} />
      <FaqSection faqData={view.faq} onOpenChat={openChat} />
      <ReviewsSection reviewsData={view.reviews} />
      <LocationSection locationData={view.location} address={view.footer.address} />
      <Footer
        footerData={view.footer}
        brand={view.brand}
        navLinks={view.header.navLinks}
        legal={view.legal}
        mapsUrl={mapsOpenUrl(view.location)}
        onOpenAdmin={() => void openAdmin()}
      />

      <ChatbotWidget onDirectBook={() => openBooking()} hidden={adminView === "preview" || !chatReady} />

      <RoomDetailsModal key={selectedRoom?.id ?? "none"} room={selectedRoom} isOpen={Boolean(selectedRoom)} onClose={closeRoom} onProceedToBooking={(room) => openBooking(room)} />
      <BookingModal key={booking.key} isOpen={booking.open} onClose={closeBooking} initialRoom={booking.room} initialDates={booking.dates} rooms={activeRooms} />

      <PasskeyModal
        isOpen={passkeyOpen}
        onClose={() => setPasskeyOpen(false)}
        onSuccess={(key) => {
          window.sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
          setPasskeyOpen(false);
          startAdmin(key);
        }}
      />

      {adminKey && draft && adminView !== "closed" && (
        <AdminModal
          draft={draft}
          set={setDraftMutable}
          dirty={dirty}
          hidden={adminView === "preview"}
          passkey={adminKey}
          publishing={publishing}
          onPublish={publish}
          onPreview={() => setAdminView("preview")}
          onDiscard={() => setDraft(structuredClone(configRef.current))}
          onRestoreDefaults={() => setDraft(structuredClone(DEFAULT_SITE_CONFIG))}
          onClose={closeAdmin}
          onLogout={logout}
          onPasskeyChanged={(key) => {
            window.sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
            setAdminKey(key);
          }}
        />
      )}

      {adminView === "preview" && (
        <div className="animate-sheet fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[55] mx-auto flex max-w-lg items-center justify-between gap-3 rounded-full bg-navy/90 py-2 pl-5 pr-2 text-sand shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/15 backdrop-blur-xl">
          <span className="flex min-w-0 items-center gap-2 text-xs">
            <Eye className="h-4 w-4 shrink-0 text-terracotta" />
            <span className="truncate">{notice ?? (dirty ? "Previewing unpublished changes" : "Preview — everything is published")}</span>
          </span>
          <div className="flex shrink-0 gap-1.5">
            <button type="button" onClick={() => setAdminView("editor")} className="btn btn-sm btn-glass">
              <PenLine />
              Edit
            </button>
            <button type="button" onClick={() => void publishFromPreview()} disabled={!dirty || publishing} className="btn btn-sm btn-light">
              {publishing && <Loader2 className="animate-spin" />}
              Publish
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
