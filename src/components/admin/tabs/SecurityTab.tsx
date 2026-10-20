"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { SectionCard, TabHeader, inputCls, labelCls } from "../fields";

export function SecurityTab({ passkey, onChanged }: { passkey: string; onChanged: (key: string) => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const clean = (v: string) => v.normalize("NFKC").replace(/\s+/g, "");
    const n = clean(next);
    if (n.length < 4 || n.length > 32) return setMessage({ type: "error", text: "Use between 4 and 32 characters." });
    if (n !== clean(confirm)) return setMessage({ type: "error", text: "The new passkeys don't match." });
    setBusy(true);
    try {
      const res = await fetch("/api/admin/passkey", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passkey": passkey },
        body: JSON.stringify({ current: clean(current), next: n }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Could not change the passkey.");
      onChanged(n);
      setCurrent("");
      setNext("");
      setConfirm("");
      setMessage({ type: "ok", text: "Passkey updated. Use the new passkey next time you sign in." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Could not change the passkey." });
    } finally {
      setBusy(false);
    }
  };

  const masked = `${inputCls} font-mono tracking-[0.3em] ${show ? "" : "text-security"}`;

  return (
    <div className="space-y-6">
      <TabHeader title="Security" description="Change the admin passkey and learn how to open the admin." />

      <SectionCard title="Change admin passkey" description="Choose 4–32 characters. Longer passkeys are more secure.">
        <form onSubmit={submit} className="space-y-4" autoComplete="off">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Current passkey", value: current, set: setCurrent },
              { label: "New passkey", value: next, set: setNext },
              { label: "Confirm new passkey", value: confirm, set: setConfirm },
            ].map((f) => (
              <label key={f.label} className="block">
                <span className={labelCls}>{f.label}</span>
                <input
                  type="text"
                  autoComplete="one-time-code"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  spellCheck={false}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className={masked}
                />
              </label>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 text-xs text-[#12232E]">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="accent-[#C87D55]" />
            Show passkeys
          </label>
          {message && <p className={`text-sm ${message.type === "ok" ? "text-emerald-700" : "text-rose-600"}`}>{message.text}</p>}
          <button type="submit" disabled={busy || !current || !next} className="btn-terracotta inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Update passkey
          </button>
        </form>
      </SectionCard>

      <SectionCard title="How to open the admin">
        <ul className="space-y-3 text-sm text-[#4F6D7A]">
          <li className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C87D55]" />
            Scroll to the bottom of the website and tap <b className="text-[#12232E]">Admin</b> in the footer.
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C87D55]" />
            Or add <b className="font-mono text-[#12232E]">/#admin</b> to your website address, e.g. yoursite.com/#admin.
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C87D55]" />
            You stay signed in until you close the browser tab or tap the sign-out icon.
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}
