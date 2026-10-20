"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CalendarCheck, Download, Loader2, Mail, MessageCircle, Plane, Plus, RotateCcw, Search, Sparkles, Users, X } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { inputCls, labelCls } from "./fields";

interface Booking {
  id: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  specialRequests: string | null;
  totalPrice: number;
  status: string;
  airportTransfer: boolean;
  notes: string | null;
  createdAt: string;
}

const STATUSES = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"] as const;
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "checked-in": "bg-sky-50 text-sky-800 border-sky-200",
  "checked-out": "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const addDays = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};
const nightsBetween = (a: string, b: string) => Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));

export function BookingsDesk({ passkey, rooms, onCountChange }: { passkey: string; rooms: SiteConfig["accommodations"]["rooms"]; onCountChange?: (n: number) => void }) {
  const today = new Date().toISOString().split("T")[0];
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomType: rooms[0]?.name ?? "",
    checkIn: today,
    checkOut: addDays(today, 3),
    guestsCount: 2,
    totalPrice: 0,
    specialRequests: "",
    airportTransfer: true,
    notes: "Arranged by booking agent",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", { headers: { "x-admin-passkey": passkey }, cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Could not load bookings");
      const rows = data.bookings as Booking[];
      setList(rows);
      setNotes(Object.fromEntries(rows.map((b) => [b.id, b.notes ?? ""])));
      onCountChange?.(rows.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load bookings");
    } finally {
      setLoading(false);
    }
  }, [passkey, onCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (b: Booking, patch: Partial<Pick<Booking, "status" | "notes">>) => {
    setSavingId(b.id);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-passkey": passkey },
        body: JSON.stringify({ id: b.id, ...patch }),
      });
      const data = await res.json();
      if (data.success) setList((prev) => prev.map((x) => (x.id === b.id ? { ...x, ...patch } : x)));
    } finally {
      setSavingId(null);
    }
  };

  const selectedRoom = rooms.find((r) => r.name === form.roomType) ?? rooms[0];
  const suggested = nightsBetween(form.checkIn, form.checkOut) * (selectedRoom?.pricePerNight ?? 0);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, totalPrice: form.totalPrice || suggested }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Could not create booking");
      setShowForm(false);
      setForm((f) => ({ ...f, guestName: "", guestEmail: "", guestPhone: "", specialRequests: "", totalPrice: 0 }));
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not create booking");
    } finally {
      setCreating(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((b) => {
      if (filter === "upcoming" && !(b.checkIn >= today && b.status !== "cancelled")) return false;
      if (filter !== "all" && filter !== "upcoming" && b.status !== filter) return false;
      if (q && ![b.guestName, b.guestEmail, b.roomType, b.guestPhone ?? "", String(b.id)].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [list, filter, query, today]);

  const stats = useMemo(() => {
    const live = list.filter((b) => b.status !== "cancelled");
    return {
      total: list.length,
      arrivals: live.filter((b) => b.checkIn >= today && b.checkIn <= addDays(today, 7)).length,
      inHouse: list.filter((b) => b.status === "checked-in").length,
      revenue: live.reduce((s, b) => s + (b.totalPrice || 0), 0),
    };
  }, [list, today]);

  const exportCsv = () => {
    const header = ["id", "status", "guestName", "guestEmail", "guestPhone", "roomType", "checkIn", "checkOut", "guests", "totalPrice", "airportTransfer", "specialRequests", "notes", "createdAt"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = list.map((b) => [b.id, b.status, b.guestName, b.guestEmail, b.guestPhone, b.roomType, b.checkIn, b.checkOut, b.guestsCount, b.totalPrice, b.airportTransfer, b.specialRequests, b.notes, b.createdAt].map(esc).join(","));
    const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `baia-bookings-${today}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 border-b border-[#12232E]/10 pb-5 sm:flex-row sm:items-end">
        <div>
          <h3 className="font-serif-luxury text-2xl text-[#12232E] sm:text-3xl">Booking Agent Desk</h3>
          <p className="mt-1 text-xs text-[#4F6D7A]">Live reservations from the website, phone and WhatsApp — confirm, check in, add notes and export.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowForm((v) => !v)} className="btn-terracotta inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Close" : "New reservation"}
          </button>
          <button onClick={exportCsv} disabled={!list.length} className="inline-flex items-center gap-2 rounded-xl border border-[#12232E]/15 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#12232E] hover:bg-[#12232E]/5 disabled:opacity-40">
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button onClick={load} aria-label="Refresh" className="rounded-xl border border-[#12232E]/15 bg-white p-2.5 text-[#12232E] hover:bg-[#12232E]/5">
            <RotateCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "All reservations", value: stats.total, icon: CalendarCheck },
          { label: "Arrivals · next 7 days", value: stats.arrivals, icon: Plane },
          { label: "Guests in-house", value: stats.inHouse, icon: Users },
          { label: "Booked revenue", value: `$${stats.revenue.toLocaleString()}`, icon: Sparkles },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#12232E]/10 bg-white p-4">
            <s.icon className="h-4 w-4 text-[#C87D55]" />
            <span className="mt-3 block font-serif-luxury text-2xl text-[#12232E]">{s.value}</span>
            <span className="text-[11px] text-[#4F6D7A]">{s.label}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={create} className="animate-fade-in space-y-4 rounded-3xl border border-[#C87D55]/30 bg-white p-5 shadow-lg sm:p-6">
          <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C87D55]">
            <Sparkles className="h-4 w-4" /> Direct reservation (phone, WhatsApp or walk-in)
          </span>
          <div className="grid gap-3 sm:grid-cols-3">
            <label><span className={labelCls}>Guest name *</span><input required value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} className={inputCls} /></label>
            <label><span className={labelCls}>Email *</span><input required type="email" value={form.guestEmail} onChange={(e) => setForm({ ...form, guestEmail: e.target.value })} className={inputCls} /></label>
            <label><span className={labelCls}>WhatsApp / phone</span><input value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} className={inputCls} /></label>
          </div>
          <div className="grid gap-3 sm:grid-cols-5">
            <label className="sm:col-span-2">
              <span className={labelCls}>Cottage</span>
              <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })} className={inputCls}>
                {rooms.map((r) => <option key={r.id} value={r.name}>{r.name} (${r.pricePerNight}/night)</option>)}
              </select>
            </label>
            <label><span className={labelCls}>Check-in</span><input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} className={inputCls} /></label>
            <label><span className={labelCls}>Check-out</span><input type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} className={inputCls} /></label>
            <label><span className={labelCls}>Guests</span><input type="number" min={1} max={6} value={form.guestsCount} onChange={(e) => setForm({ ...form, guestsCount: Number(e.target.value) })} className={inputCls} /></label>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label><span className={labelCls}>Total (USD)</span><input type="number" min={0} placeholder={String(suggested)} value={form.totalPrice || ""} onChange={(e) => setForm({ ...form, totalPrice: Number(e.target.value) })} className={inputCls} /><span className="mt-1 block text-[11px] text-[#4F6D7A]">Suggested ${suggested} for {nightsBetween(form.checkIn, form.checkOut)} nights</span></label>
            <label className="sm:col-span-2"><span className={labelCls}>Special requests</span><input value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} className={inputCls} /></label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-xs text-[#12232E]"><input type="checkbox" checked={form.airportTransfer} onChange={(e) => setForm({ ...form, airportTransfer: e.target.checked })} className="accent-[#C87D55]" />Free SWL airport transfer</label>
            <button type="submit" disabled={creating} className="btn-terracotta inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold uppercase tracking-wider disabled:opacity-60">
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}Confirm reservation
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-[#12232E]/10 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex w-full items-center gap-2 px-1 sm:w-auto">
          <Search className="h-4 w-4 text-[#4F6D7A]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search guest, email, phone, cottage or #ID…" className="w-full bg-transparent text-xs text-[#12232E] focus:outline-none sm:w-72" />
        </label>
        <div className="flex flex-wrap gap-1">
          {["all", "upcoming", ...STATUSES].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition ${filter === f ? "bg-[#12232E] text-white" : "bg-[#FBF9F5] text-[#4F6D7A] hover:text-[#12232E]"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}

      {loading ? (
        <div className="py-14 text-center text-xs text-[#4F6D7A]"><Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#C87D55]" />Loading reservations…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-[#12232E]/10 bg-white p-10 text-center">
          <p className="font-serif-luxury text-lg text-[#12232E]">No reservations to show.</p>
          <p className="mt-1 text-xs text-[#4F6D7A]">Website bookings and manual entries appear here instantly.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const wa = (b.guestPhone ?? "").replace(/[^\d]/g, "");
            return (
              <article key={b.id} className="space-y-3 rounded-2xl border border-[#12232E]/10 bg-white p-4 transition hover:border-[#C87D55]/40 sm:p-5">
                <div className="flex flex-col justify-between gap-3 border-b border-[#12232E]/6 pb-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-[#C87D55]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#C87D55]">#{b.id}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-[#12232E]">{b.guestName}</h4>
                      <span className="text-xs text-[#4F6D7A]">{b.guestEmail}{b.guestPhone ? ` · ${b.guestPhone}` : ""}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`mailto:${b.guestEmail}`} aria-label="Email guest" className="rounded-lg border border-[#12232E]/10 p-2 text-[#12232E]/70 hover:bg-[#12232E]/5"><Mail className="h-3.5 w-3.5" /></a>
                    {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" aria-label="WhatsApp guest" className="rounded-lg border border-emerald-200 p-2 text-emerald-700 hover:bg-emerald-50"><MessageCircle className="h-3.5 w-3.5" /></a>}
                    <div className="text-right">
                      <span className="block text-xs font-bold text-[#12232E]">${b.totalPrice.toLocaleString()}</span>
                      <span className="block text-[10px] text-[#4F6D7A]">{b.roomType}</span>
                    </div>
                    <select
                      value={b.status}
                      disabled={savingId === b.id}
                      onChange={(e) => update(b, { status: e.target.value })}
                      className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[b.status] ?? STATUS_STYLES.pending}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid gap-3 text-xs text-[#4F6D7A] sm:grid-cols-3">
                  <div><span className="block font-semibold text-[#12232E]">Stay</span>{b.checkIn} → {b.checkOut} · {nightsBetween(b.checkIn, b.checkOut)} nights · {b.guestsCount} guests</div>
                  <div><span className="block font-semibold text-[#12232E]">Airport chauffeur</span><span className={b.airportTransfer ? "font-medium text-emerald-700" : ""}>{b.airportTransfer ? "Free SWL pickup requested" : "Not needed"}</span></div>
                  <div><span className="block font-semibold text-[#12232E]">Requests</span><span className="italic">{b.specialRequests || "None"}</span></div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={notes[b.id] ?? ""}
                    onChange={(e) => setNotes({ ...notes, [b.id]: e.target.value })}
                    placeholder="Agent notes (flight PR2911 lands 14:15, anniversary set-up, dietary)…"
                    className={`${inputCls} py-2 text-xs`}
                  />
                  <button onClick={() => update(b, { notes: notes[b.id] ?? "" })} disabled={savingId === b.id} className="shrink-0 rounded-xl bg-[#12232E] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#C87D55] disabled:opacity-60">
                    {savingId === b.id ? "Saving…" : "Save note"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
