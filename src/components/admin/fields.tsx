"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Image as ImageIcon, Loader2, Plus, Trash2, Upload } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";

export type Setter = (mutate: (draft: SiteConfig) => void) => void;
export interface TabProps {
  data: SiteConfig;
  set: Setter;
  passkey: string;
}

export const inputCls =
  "w-full rounded-xl border border-[#12232E]/12 bg-[#FBF9F5] px-3 py-2.5 text-[13px] text-[#12232E] placeholder:text-[#12232E]/35 transition focus:border-[#C87D55] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/25";

export const labelCls = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#12232E]/65";

export function TabHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-3 border-b border-[#12232E]/10 pb-5 sm:flex-row sm:items-end">
      <div>
        <h3 className="font-serif-luxury text-2xl text-[#12232E] sm:text-3xl">{title}</h3>
        {description && <p className="mt-1 max-w-2xl text-xs text-[#4F6D7A]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionCard({ title, description, actions, children }: { title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#12232E]/10 bg-white p-5 shadow-[0_1px_0_rgba(18,35,46,0.03)] sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-serif-luxury text-xl text-[#12232E]">{title}</h4>
          {description && <p className="mt-0.5 text-xs text-[#4F6D7A]">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function TextInput({
  label, value, onChange, placeholder, type = "text", hint, className = "",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; hint?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      <input type={type} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      {hint && <span className="mt-1 block text-[11px] text-[#4F6D7A]">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label, value, onChange, rows = 3, placeholder, hint, className = "",
}: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; hint?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      <textarea rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-y leading-relaxed`} />
      {hint && <span className="mt-1 block text-[11px] text-[#4F6D7A]">{hint}</span>}
    </label>
  );
}

export function NumberInput({
  label, value, onChange, step = 1, min, max, hint, className = "",
}: { label: string; value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; hint?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      <input type="number" value={Number.isFinite(value) ? value : 0} step={step} min={min} max={max} onChange={(e) => onChange(Number(e.target.value))} className={inputCls} />
      {hint && <span className="mt-1 block text-[11px] text-[#4F6D7A]">{hint}</span>}
    </label>
  );
}

export function RangeInput({
  label, value, onChange, min, max, unit = "",
}: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; unit?: string }) {
  return (
    <label className="block">
      <span className={`${labelCls} flex items-center justify-between`}>
        <span>{label}</span>
        <span className="font-mono normal-case tracking-normal text-[#C87D55]">{value}{unit}</span>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#C87D55]" />
    </label>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#12232E]/10 bg-white px-3.5 py-2.5 text-left transition hover:border-[#12232E]/20"
    >
      <span>
        <span className="block text-[13px] font-medium text-[#12232E]">{label}</span>
        {hint && <span className="block text-[11px] text-[#4F6D7A]">{hint}</span>}
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#C87D55]" : "bg-[#12232E]/15"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

const parseLines = (t: string) => t.split("\n").map((s) => s.trim()).filter(Boolean);

/** One item per line (amenities, features, highlights) */
export function LinesInput({ label, value, onChange, rows = 4, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; rows?: number; hint?: string }) {
  const [text, setText] = useState(value.join("\n"));
  useEffect(() => {
    if (parseLines(text).join("\n") !== value.join("\n")) setText(value.join("\n"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <textarea
        rows={rows}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(parseLines(e.target.value));
        }}
        className={`${inputCls} resize-y leading-relaxed`}
      />
      <span className="mt-1 block text-[11px] text-[#4F6D7A]">{hint ?? "One item per line."}</span>
    </label>
  );
}

export function ColorInput({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <span className="flex items-center gap-2 rounded-xl border border-[#12232E]/12 bg-white p-1.5">
        <input type="color" value={safe} onChange={(e) => onChange(e.target.value.toUpperCase())} className="h-8 w-10 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent font-mono text-xs uppercase text-[#12232E] focus:outline-none" />
      </span>
      {hint && <span className="mt-1 block text-[11px] text-[#4F6D7A]">{hint}</span>}
    </label>
  );
}

export function IconButton({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-8 w-8 place-items-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? "border-rose-200 text-rose-600 hover:bg-rose-50" : "border-[#12232E]/10 text-[#12232E]/70 hover:bg-[#12232E]/5"
      }`}
    >
      {children}
    </button>
  );
}

export function ItemShell({
  title, subtitle, index, total, onMove, onRemove, children, leading,
}: { title: string; subtitle?: string; index: number; total: number; onMove: (dir: -1 | 1) => void; onRemove: () => void; children: ReactNode; leading?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#12232E]/10 bg-[#FBF9F5]/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {leading}
          <div className="min-w-0">
            <span className="block truncate text-[13px] font-semibold text-[#12232E]">{title}</span>
            {subtitle && <span className="block truncate text-[11px] text-[#4F6D7A]">{subtitle}</span>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            <ArrowUp className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton label="Move down" disabled={index >= total - 1} onClick={() => onMove(1)}>
            <ArrowDown className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton label="Remove" danger onClick={onRemove}>
            <Trash2 className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#12232E]/20 py-3 text-xs font-semibold text-[#12232E]/70 transition hover:border-[#C87D55] hover:bg-[#C87D55]/5 hover:text-[#C87D55]"
    >
      <Plus className="h-4 w-4" />
      {children}
    </button>
  );
}

export function listOps<T>(set: Setter, pick: (d: SiteConfig) => T[]) {
  return {
    add: (item: T) => set((d) => { pick(d).push(item); }),
    remove: (i: number) => set((d) => { pick(d).splice(i, 1); }),
    move: (i: number, dir: number) =>
      set((d) => {
        const a = pick(d);
        const j = i + dir;
        if (j < 0 || j >= a.length) return;
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }),
  };
}

export async function uploadFile(file: Blob, passkey: string, filename?: string): Promise<{ url: string; type: "image" | "video" }> {
  const fd = new FormData();
  fd.append("file", file, filename ?? (file instanceof File ? file.name : "upload.png"));
  fd.append("passkey", passkey);
  const res = await fetch("/api/upload", { method: "POST", headers: { "x-admin-passkey": passkey }, body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");
  return { url: data.url as string, type: data.type === "video" ? "video" : "image" };
}

export function UploadButton({
  passkey, onUploaded, accept = "image/*", label = "Upload from device",
}: { passkey: string; onUploaded: (url: string, type: "image" | "video") => void; accept?: string; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <span className="inline-flex flex-col">
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setBusy(true);
          setError("");
          try {
            const r = await uploadFile(f, passkey);
            onUploaded(r.url, r.type);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
          }
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#C87D55]/60 bg-[#C87D55]/5 px-3.5 py-2 text-xs font-semibold text-[#C87D55] transition hover:bg-[#C87D55]/10 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        {busy ? "Uploading…" : label}
      </button>
      {error && <span className="mt-1 text-[11px] text-rose-600">{error}</span>}
    </span>
  );
}

export function ImageField({ label, value, onChange, passkey, hint }: { label: string; value: string; onChange: (v: string) => void; passkey: string; hint?: string }) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="flex gap-3">
        <div className="bg-checker h-[74px] w-28 shrink-0 overflow-hidden rounded-xl border border-[#12232E]/10">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full place-items-center text-[#12232E]/30">
              <ImageIcon className="h-5 w-5" />
            </span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Paste an image URL or upload" className={inputCls} />
          <UploadButton passkey={passkey} onUploaded={(url) => onChange(url)} />
        </div>
      </div>
      {hint && <span className="mt-1 block text-[11px] text-[#4F6D7A]">{hint}</span>}
    </div>
  );
}

export function SelectInput({
  label, value, onChange, options, className = "",
}: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
