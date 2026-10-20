"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, KeyRound, Loader2, X } from "lucide-react";

interface PasskeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (passkey: string) => void;
}

export function PasskeyModal({ isOpen, onClose, onSuccess }: PasskeyModalProps) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setValue("");
    setError("");
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const key = value.replace(/\s+/g, "");
    if (!key || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json", "cache": "no-store" as any },
        body: JSON.stringify({ passkey: key }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        onSuccess(key);
        return;
      }
      if (res.status === 429) {
        setError(data.error || "Too many attempts — please wait a few minutes.");
      } else if (res.status === 401) {
        setError("That passkey isn't correct. Try 5309, or the one you set in Admin → Security.");
      } else {
        setError(`Server error (${res.status}). Please try again.`);
      }
    } catch {
      setError("Connection problem — please check your internet and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Admin sign in"
        onClick={(e) => e.stopPropagation()}
        className="animate-sheet relative w-full max-w-sm rounded-t-[1.75rem] bg-sand px-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-9 text-center text-navy shadow-2xl sm:rounded-[1.75rem] sm:p-9"
      >
        <button type="button" onClick={onClose} aria-label="Close" className="btn btn-sm btn-icon btn-outline absolute right-4 top-4">
          <X />
        </button>

        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy text-sand">
          <KeyRound className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <p className="eyebrow eyebrow-center mt-6">Owner access</p>
        <h2 className="mt-3 font-serif-luxury text-3xl font-light">BAIA Admin</h2>
        <p className="mt-2 text-sm text-ocean">Enter your passkey to manage the website and bookings.</p>
        <p className="mt-1 text-[10px] text-[#4F6D7A]/70">Default passkey: 5309 · change it in Admin → Security after your first login.</p>

        <form onSubmit={submit} className="mt-7 space-y-3" autoComplete="off">
          <div className="relative">
            <input
              ref={inputRef}
              id="baia-admin-passkey"
              name="baia-admin-passkey"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
              data-form-type="other"
              aria-label="Passkey"
              aria-invalid={Boolean(error)}
              placeholder="••••"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              className={`w-full rounded-2xl bg-white px-12 py-4 text-center font-mono text-xl tracking-[0.45em] text-navy outline-none ring-1 ring-navy/15 transition placeholder:tracking-[0.3em] placeholder:text-navy/25 focus:ring-2 focus:ring-terracotta/50 ${show ? "" : "text-security"}`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide passkey" : "Show passkey"}
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-navy/40 transition hover:text-navy"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && (
            <p role="alert" className="text-sm leading-snug text-rose-600">{error}</p>
          )}
          <button type="submit" disabled={busy || !value.trim()} className="btn btn-primary btn-lg btn-block">
            {busy && <Loader2 className="animate-spin" />}
            Unlock admin
            {!busy && <ArrowRight />}
          </button>
        </form>
      </div>
    </div>
  );
}
