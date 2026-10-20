"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUp, CalendarCheck, Sparkles, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const PROMPTS = ["Cottages & rates", "Why book direct?", "Airport transfer", "Is the water calm?", "Dining & diets"];
const GREETING: Message = {
  id: "hello",
  role: "assistant",
  content: "Mabuhay! I'm BAIA's digital concierge. Ask me about our cottages and rates, the calm waters, island hopping, dining, or getting here from San Vicente airport.",
};

export function ChatbotWidget({ onDirectBook, hidden = false }: { onDirectBook: () => void; hidden?: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const sessionRef = useRef("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sid = window.localStorage.getItem("baia_chat_session");
    if (!sid) {
      sid = `s_${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem("baia_chat_session", sid);
    }
    sessionRef.current = sid;
    const openChat = () => setOpen(true);
    window.addEventListener("baia:open-chat", openChat);
    return () => window.removeEventListener("baia:open-chat", openChat);
  }, []);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return;
    const phone = window.matchMedia("(max-width: 639px)").matches;
    const previous = document.body.style.overflow;
    if (phone) document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setMessages((m) => [...m, { id: `u${Date.now()}`, role: "user", content: text }]);
    setInput("");
    setBusy(true);
    let reply = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionRef.current || "anon", message: text }),
      });
      const data = await res.json();
      reply = data?.reply?.content ?? "";
    } catch {
      /* handled below */
    }
    setMessages((m) => [
      ...m,
      { id: `a${Date.now()}`, role: "assistant", content: reply || "Sorry — I couldn't connect just now. Please try again, or tap “Check availability” to book direct." },
    ]);
    setBusy(false);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <>
      {!hidden && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="ask-baia"
          aria-label={open ? "Close Ask BAIA" : "Ask BAIA"}
          className={`animate-fade-in fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-5 text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-xl transition-colors duration-300 sm:bottom-6 sm:right-6 ${
            open ? "hidden bg-navy sm:inline-flex" : "inline-flex bg-navy/80 hover:bg-navy"
          }`}
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/10">
            {open ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" strokeWidth={1.7} />}
            {!open && <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-navy" />}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">{open ? "Close" : "Ask BAIA"}</span>
        </button>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
          <section
            id="ask-baia"
            role="dialog"
            aria-label="Ask BAIA"
            className="animate-sheet fixed inset-x-0 bottom-0 z-50 flex h-[85svh] flex-col overflow-hidden rounded-t-[1.75rem] bg-sand text-navy shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[min(620px,calc(100svh-8rem))] sm:w-[400px] sm:rounded-[1.75rem] sm:ring-1 sm:ring-navy/10"
          >
            <header className="relative flex items-center justify-between gap-3 bg-navy px-5 pb-4 pt-5 text-sand">
              <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/25 sm:hidden" />
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <Sparkles className="h-4 w-4" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="font-serif-luxury text-xl leading-none">Ask BAIA</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-sand/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Digital concierge · replies instantly
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="btn btn-sm btn-icon btn-glass">
                <X />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 text-[14px] leading-relaxed" aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <p
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 ${
                      m.role === "user" ? "rounded-br-md bg-navy text-sand" : "rounded-bl-md bg-white text-navy ring-1 ring-navy/[0.07]"
                    }`}
                  >
                    {m.content}
                  </p>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <span className="inline-flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3.5 ring-1 ring-navy/[0.07]">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy/40" style={{ animationDelay: `${d * 120}ms` }} />
                    ))}
                  </span>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-navy/[0.07] bg-white/70 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
              <div className="flex flex-wrap gap-1.5 pb-3">
                {PROMPTS.map((p) => (
                  <button key={p} type="button" onClick={() => void send(p)} className="chip bg-white px-3 py-1.5 text-[11px]">
                    {p}
                  </button>
                ))}
              </div>
              <form onSubmit={submit} className="flex items-center gap-2 rounded-full bg-white p-1.5 ring-1 ring-navy/10 transition focus-within:ring-navy/30">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about cottages, rates, transfers…"
                  aria-label="Message"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-navy outline-none placeholder:text-navy/35"
                />
                <button type="submit" disabled={!input.trim() || busy} aria-label="Send" className="btn btn-sm btn-icon btn-primary">
                  <ArrowUp />
                </button>
              </form>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onDirectBook();
                }}
                className="mt-2.5 flex w-full items-center justify-center gap-1.5 py-1 text-[11px] font-medium text-ocean transition hover:text-navy"
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                Check availability &amp; book direct
              </button>
            </div>
          </section>
        </>
      )}
    </>
  );
}
