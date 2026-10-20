"use client";

import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { uploadFile } from "./fields";

interface ProcessOptions {
  removeBg: boolean;
  trim: boolean;
  tolerance: number;
}

interface Decoded {
  source: CanvasImageSource;
  width: number;
  height: number;
  cleanup: () => void;
}

async function decode(file: File): Promise<Decoded> {
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file);
      return { source: bmp, width: bmp.width, height: bmp.height, cleanup: () => bmp.close() };
    } catch {
      /* fall back to <img> decoding (older Safari) */
    }
  }
  const url = URL.createObjectURL(file);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("This image could not be read by your browser."));
    img.src = url;
  });
  return { source: img, width: img.naturalWidth, height: img.naturalHeight, cleanup: () => URL.revokeObjectURL(url) };
}

/**
 * Makes a logo transparent in the browser: samples the background colour from the
 * corners, keys it out with a soft edge (un-blending to avoid halos) and trims margins.
 */
export async function makeTransparent(file: File, opts: ProcessOptions): Promise<Blob> {
  const decoded = await decode(file);
  try {
    const scale = Math.min(1, 2400 / Math.max(decoded.width, decoded.height));
    const w = Math.max(1, Math.round(decoded.width * scale));
    const h = Math.max(1, Math.round(decoded.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas is not supported in this browser");
    ctx.drawImage(decoded.source, 0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h);
    const px = img.data;

    if (opts.removeBg) {
      const corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + (w - 1)) * 4];
      const bg = [0, 1, 2].map((c) => corners.reduce((sum, i) => sum + px[i + c], 0) / corners.length);
      const hard = opts.tolerance;
      const soft = Math.max(16, opts.tolerance * 1.5);
      for (let i = 0; i < px.length; i += 4) {
        const d = Math.sqrt((px[i] - bg[0]) ** 2 + (px[i + 1] - bg[1]) ** 2 + (px[i + 2] - bg[2]) ** 2);
        if (d >= hard + soft) continue;
        const a = d <= hard ? 0 : (d - hard) / soft;
        if (a > 0) {
          for (let c = 0; c < 3; c++) px[i + c] = Math.max(0, Math.min(255, Math.round((px[i + c] - bg[c] * (1 - a)) / a)));
        }
        px[i + 3] = Math.round(px[i + 3] * a);
      }
      ctx.putImageData(img, 0, 0);
    }

    let out: HTMLCanvasElement = canvas;
    if (opts.trim) {
      let minX = w;
      let minY = h;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (px[(y * w + x) * 4 + 3] > 12) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX >= minX && maxY >= minY && (maxX - minX < w - 2 || maxY - minY < h - 2)) {
        const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.03);
        const sx = Math.max(0, minX - pad);
        const sy = Math.max(0, minY - pad);
        const sw = Math.min(w, maxX + pad + 1) - sx;
        const sh = Math.min(h, maxY + pad + 1) - sy;
        const cropped = document.createElement("canvas");
        cropped.width = sw;
        cropped.height = sh;
        cropped.getContext("2d")?.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
        out = cropped;
      }
    }

    return await new Promise<Blob>((resolve, reject) => out.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not export PNG"))), "image/png"));
  } finally {
    decoded.cleanup();
  }
}

interface LogoUploaderProps {
  passkey: string;
  label: string;
  description: string;
  value: string;
  onChange: (url: string) => void;
  whitenOnDark?: boolean;
}

export function LogoUploader({ passkey, label, description, value, onChange, whitenOnDark = false }: LogoUploaderProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [removeBg, setRemoveBg] = useState(true);
  const [trim, setTrim] = useState(true);
  const [tolerance, setTolerance] = useState(28);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const handle = async (file: File) => {
    if (!/^image\//.test(file.type) && !/\.(png|jpe?g|webp|svg)$/i.test(file.name)) {
      setMessage({ type: "error", text: "Please choose a PNG, JPG, WEBP or SVG image." });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      let blob: Blob = file;
      let name = file.name;
      let processed = false;
      if (/^image\/(png|jpe?g|webp)$/i.test(file.type) && (removeBg || trim)) {
        try {
          blob = await makeTransparent(file, { removeBg, trim, tolerance });
          name = `${file.name.replace(/\.[^.]+$/, "") || "logo"}-transparent.png`;
          processed = true;
        } catch {
          blob = file;
          name = file.name;
        }
      }
      const { url } = await uploadFile(blob, passkey, name);
      onChange(url);
      setMessage({
        type: "ok",
        text: processed ? "Uploaded with a transparent background. Press Publish to make it live." : "Uploaded. Press Publish to make it live.",
      });
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Upload failed — please try again." });
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void handle(f);
  };

  const previews = [
    { bg: "bg-checker", label: "Transparent", dark: false, whiten: false },
    { bg: "bg-[#FBF9F5]", label: "Light", dark: false, whiten: false },
    { bg: "bg-[#12232E]", label: "Dark", dark: true, whiten: whitenOnDark },
  ];

  return (
    <div className="rounded-2xl border border-[#12232E]/10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="block text-[13px] font-semibold text-[#12232E]">{label}</span>
          <span className="text-[11px] text-[#4F6D7A]">{description}</span>
        </div>
        {value && (
          <button type="button" onClick={() => onChange("")} className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-800">
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`mt-3 grid grid-cols-3 gap-2 rounded-2xl p-1 transition ${dragging ? "bg-[#C87D55]/10 ring-2 ring-[#C87D55]/40" : ""}`}
      >
        {previews.map((p) => (
          <div key={p.label} className={`relative grid h-24 place-items-center rounded-xl border border-[#12232E]/10 p-3 ${p.bg}`}>
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="max-h-full max-w-full object-contain" style={p.whiten ? { filter: "brightness(0) invert(1)" } : undefined} />
            ) : (
              <span className={`text-[10px] ${p.dark ? "text-white/40" : "text-[#12232E]/40"}`}>No logo yet</span>
            )}
            <span className={`absolute bottom-1 left-2 text-[9px] uppercase tracking-wider ${p.dark ? "text-white/40" : "text-[#12232E]/40"}`}>{p.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#12232E]">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} className="accent-[#C87D55]" />
          Remove white background
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} className="accent-[#C87D55]" />
          Trim empty margins
        </label>
        <label className="inline-flex items-center gap-2">
          Tolerance
          <input type="range" min={6} max={90} value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} className="w-24 accent-[#C87D55]" />
          <span className="w-6 font-mono text-[11px] text-[#C87D55]">{tolerance}</span>
        </label>
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void handle(f);
        }}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl bg-[#12232E] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#C87D55] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          {busy ? "Processing…" : value ? "Replace logo" : "Upload logo"}
        </button>
        <span className="text-[11px] text-[#4F6D7A]">or drag &amp; drop a file onto the previews</span>
      </div>
      {message && <p className={`mt-2 text-[12px] ${message.type === "ok" ? "text-emerald-700" : "text-rose-600"}`}>{message.text}</p>}
    </div>
  );
}
