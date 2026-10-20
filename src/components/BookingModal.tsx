"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, Plane, X } from "lucide-react";
import { ROOMS } from "@/lib/data";

interface RoomOption {
  id: string;
  name: string;
  pricePerNight: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoom?: { id: string } | null;
  initialDates?: { checkIn: string; checkOut: string; guests: number } | null;
  rooms?: RoomOption[];
}

const iso = (d: Date) => d.toISOString().split("T")[0];
const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};

const field = "w-full rounded-xl bg-white px-3.5 py-3 text-sm text-navy outline-none ring-1 ring-navy/10 transition placeholder:text-navy/35 focus:ring-2 focus:ring-terracotta/40";
const labelCls = "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-ocean";

export function BookingModal({ isOpen, onClose, initialRoom, initialDates, rooms }: BookingModalProps) {
  const roomList: RoomOption[] = rooms && rooms.length > 0 ? rooms : ROOMS;
  const [roomId, setRoomId] = useState(initialRoom?.id && roomList.some((r) => r.id === initialRoom.id) ? initialRoom.id : roomList[0]?.id ?? "");
  const [checkIn, setCheckIn] = useState(initialDates?.checkIn || plusDays(14));
  const [checkOut, setCheckOut] = useState(initialDates?.checkOut || plusDays(18));
  const [guests, setGuests] = useState(initialDates?.guests || 2);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [airportTransfer, setAirportTransfer] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<null | { id: number | string; roomName: string; nights: number; total: number }>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const room = roomList.find((r) => r.id === roomId) ?? roomList[0];
  const validDates = checkOut > checkIn;
  const nights = validDates ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 0;
  const total = room ? nights * room.pricePerNight : 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!room) return;
    if (!validDates) {
      setError("Check-out must be after check-in.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName, guestEmail, guestPhone, roomType: room.name, checkIn, checkOut, guestsCount: guests, specialRequests, totalPrice: total, airportTransfer }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "We could not complete your reservation.");
      setConfirmed({ id: data.booking?.id ?? "—", roomName: room.name, nights, total });
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not complete your reservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Reserve your stay"
        onClick={(e) => e.stopPropagation()}
        className="animate-sheet relative flex max-h-[94svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.75rem] bg-sand text-navy shadow-2xl sm:rounded-[1.75rem]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-navy/[0.08] px-5 pb-4 pt-5 sm:px-8 sm:pt-7">
          <div>
            <p className="eyebrow">Direct reservation</p>
            <h2 className="mt-2 font-serif-luxury text-[1.75rem] font-light leading-tight sm:text-3xl">Reserve your stay</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="btn btn-sm btn-icon btn-outline shrink-0">
            <X />
          </button>
        </div>

        {confirmed ? (
          <div className="flex flex-col items-center overflow-y-auto px-6 py-10 text-center sm:px-12">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <CheckCircle2 className="h-8 w-8" strokeWidth={1.6} />
            </span>
            <h3 className="mt-6 font-serif-luxury text-3xl font-light">Welcome to the BAIA family</h3>
            <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-ocean">
              Your stay in the <b className="font-semibold text-navy">{confirmed.roomName}</b> for {confirmed.nights} night{confirmed.nights > 1 ? "s" : ""} is reserved. Our host will
              confirm personally by email or WhatsApp.
            </p>
            <dl className="mt-6 w-full max-w-md space-y-2 rounded-2xl bg-white p-4 text-left text-sm ring-1 ring-navy/[0.08]">
              <div className="flex justify-between">
                <dt className="text-ocean">Reference</dt>
                <dd className="font-mono font-semibold">#{confirmed.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ocean">Dates</dt>
                <dd className="font-medium">
                  {checkIn} → {checkOut}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ocean">Total</dt>
                <dd className="font-semibold">${confirmed.total.toLocaleString()} USD</dd>
              </div>
            </dl>
            <button type="button" onClick={onClose} className="btn btn-outline mt-8">
              Back to the lodge
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-8">
              <div>
                <span className={labelCls}>Cottage</span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {roomList.map((r) => {
                    const selected = r.id === room?.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRoomId(r.id)}
                        aria-pressed={selected}
                        className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left ring-1 transition sm:flex-col sm:items-start sm:justify-start sm:gap-1 sm:p-4 ${selected ? "bg-navy text-sand ring-navy" : "bg-white text-navy ring-navy/10 hover:ring-navy/30"}`}
                      >
                        <span className="text-[13px] font-semibold leading-snug">{r.name}</span>
                        <span className={`shrink-0 text-xs ${selected ? "text-sand/70" : "text-ocean"}`}>${r.pricePerNight} / night</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <label>
                  <span className={labelCls}>Check-in</span>
                  <input type="date" required min={iso(new Date())} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={field} />
                </label>
                <label>
                  <span className={labelCls}>Check-out</span>
                  <input type="date" required min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={field} />
                </label>
                <label className="col-span-2 sm:col-span-1">
                  <span className={labelCls}>Guests</span>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={field}>
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} guest{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  <span className={labelCls}>Full name</span>
                  <input required value={guestName} onChange={(e) => setGuestName(e.target.value)} autoComplete="name" className={field} />
                </label>
                <label>
                  <span className={labelCls}>Email</span>
                  <input required type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} autoComplete="email" className={field} />
                </label>
                <label>
                  <span className={labelCls}>WhatsApp / mobile</span>
                  <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} autoComplete="tel" placeholder="+63 917 000 0000" className={field} />
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-3.5 py-3 text-sm ring-1 ring-navy/10 sm:mt-[1.4rem]">
                  <input type="checkbox" checked={airportTransfer} onChange={(e) => setAirportTransfer(e.target.checked)} className="h-4 w-4 accent-[var(--marine-navy)]" />
                  <Plane className="h-4 w-4 text-terracotta" strokeWidth={1.7} />
                  Free airport chauffeur (SWL)
                </label>
              </div>

              <label className="block">
                <span className={labelCls}>Requests (optional)</span>
                <textarea rows={2} value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Dietary preferences, arrival time, celebrations…" className={field} />
              </label>

              {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-navy/[0.08] bg-white/80 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:px-8 sm:pb-4">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.22em] text-ocean">
                  {validDates ? `${nights} night${nights > 1 ? "s" : ""} · breakfast incl.` : "Select dates"}
                </span>
                <span className="font-serif-luxury text-2xl">${total.toLocaleString()}</span>
                <span className="ml-1 text-xs text-ocean">USD</span>
              </div>
              <button type="submit" disabled={loading || !validDates} className="btn btn-primary">
                {loading ? <Loader2 className="animate-spin" /> : null}
                {loading ? "Reserving…" : "Confirm"}
                {!loading && <ArrowUpRight />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
