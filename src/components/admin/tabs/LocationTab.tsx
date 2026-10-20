"use client";

import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { formatCoords, mapEmbedUrl, parseLatLng } from "@/lib/maps";
import { AddButton, ItemShell, NumberInput, RangeInput, SectionCard, SelectInput, TabHeader, TextArea, TextInput, inputCls, listOps } from "../fields";
import type { TabProps } from "../fields";

export function LocationTab({ data, set, passkey }: TabProps) {
  const l = data.location;
  const hl = listOps(set, (d) => d.location.highlights);
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const apply = (p: { lat: number; lng: number; zoom?: number }) => {
    set((d) => {
      d.location.mapLat = Number(p.lat.toFixed(6));
      d.location.mapLng = Number(p.lng.toFixed(6));
      if (p.zoom) d.location.mapZoom = Math.min(20, Math.max(3, Math.round(p.zoom)));
    });
    setMessage({ type: "ok", text: `Pin moved to ${formatCoords(p.lat, p.lng)}. Press Publish to update the website.` });
  };

  const findPin = async () => {
    const value = link.trim();
    if (!value) return;
    setMessage(null);
    const direct = parseLatLng(value);
    if (direct) {
      apply(direct);
      return;
    }
    if (!/^https?:\/\//i.test(value)) {
      setMessage({ type: "error", text: "Paste a Google Maps link, or coordinates like 10.538582, 119.237916." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/resolve-map", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passkey": passkey },
        body: JSON.stringify({ url: value }),
      });
      const json = await res.json().catch(() => ({}));
      const parsed = typeof json.url === "string" ? parseLatLng(json.url) : null;
      if (parsed) apply(parsed);
      else
        setMessage({
          type: "error",
          text: json.error || "No coordinates found in that link. In Google Maps, long-press (or right-click) your pin and copy the numbers shown.",
        });
    } catch {
      setMessage({ type: "error", text: "Connection problem — please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <TabHeader title="Location & Map" description="Set the exact map pin, the map style and the nearby places shown on the website." />

      <SectionCard title="Section text">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Badge" value={l.badge} onChange={(v) => set((d) => { d.location.badge = v; })} />
          <TextInput label="Title" value={l.title} onChange={(v) => set((d) => { d.location.title = v; })} />
        </div>
        <TextArea label="Subtitle" rows={2} value={l.subtitle} onChange={(v) => set((d) => { d.location.subtitle = v; })} />
      </SectionCard>

      <SectionCard title="Map pin" description="Paste a Google Maps link or coordinates to move the pin — or type the latitude and longitude below.">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void findPin();
              }
            }}
            placeholder="https://maps.app.goo.gl/…   or   10.538582, 119.237916"
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => void findPin()}
            disabled={busy || !link.trim()}
            className="btn-terracotta inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            Set pin
          </button>
        </div>
        {message && <p className={`text-sm ${message.type === "ok" ? "text-emerald-700" : "text-rose-600"}`}>{message.text}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Latitude" value={l.mapLat} step={0.000001} min={-90} max={90} onChange={(v) => set((d) => { d.location.mapLat = v; })} />
          <NumberInput label="Longitude" value={l.mapLng} step={0.000001} min={-180} max={180} onChange={(v) => set((d) => { d.location.mapLng = v; })} />
          <RangeInput label="Zoom" value={l.mapZoom} min={10} max={19} onChange={(v) => set((d) => { d.location.mapZoom = v; })} />
          <SelectInput
            label="Default view"
            value={l.mapType}
            onChange={(v) => set((d) => { d.location.mapType = v === "map" ? "map" : "satellite"; })}
            options={[
              { value: "satellite", label: "Satellite (with labels)" },
              { value: "map", label: "Map" },
            ]}
          />
        </div>

        <div className="overflow-hidden rounded-2xl ring-1 ring-[#12232E]/10">
          <iframe
            key={`${l.mapLat},${l.mapLng},${l.mapZoom},${l.mapType}`}
            src={mapEmbedUrl(l.mapLat, l.mapLng, l.mapZoom, l.mapType)}
            title="Map preview"
            loading="lazy"
            className="block aspect-[16/10] w-full border-0"
          />
        </div>
        <p className="font-mono text-[11px] text-[#4F6D7A]">{formatCoords(l.mapLat, l.mapLng)}</p>

        <TextInput
          label="Google Maps business link (optional)"
          value={l.googleMapsUrl}
          placeholder="https://maps.app.goo.gl/…"
          hint="Used by the “Open in Google Maps” button. Leave empty to use the pin above."
          onChange={(v) => set((d) => { d.location.googleMapsUrl = v; })}
        />
        <TextArea label="Airport transfer note" rows={2} value={l.airportNote} onChange={(v) => set((d) => { d.location.airportNote = v; })} />
      </SectionCard>

      <SectionCard title="Nearby places">
        {l.highlights.map((p, i) => (
          <ItemShell key={i} title={p.name} subtitle={p.distance} index={i} total={l.highlights.length} onMove={(dir) => hl.move(i, dir)} onRemove={() => hl.remove(i)}>
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput label="Name" value={p.name} onChange={(v) => set((d) => { d.location.highlights[i].name = v; })} />
              <TextInput label="Distance" value={p.distance} onChange={(v) => set((d) => { d.location.highlights[i].distance = v; })} />
              <TextInput label="Travel time" value={p.type} onChange={(v) => set((d) => { d.location.highlights[i].type = v; })} />
            </div>
            <TextInput label="Description" value={p.desc} onChange={(v) => set((d) => { d.location.highlights[i].desc = v; })} />
          </ItemShell>
        ))}
        <AddButton onClick={() => hl.add({ name: "New place", distance: "1 km", type: "Short drive", desc: "Why guests love it" })}>Add place</AddButton>
      </SectionCard>
    </div>
  );
}
