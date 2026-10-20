"use client";

import { Eye, EyeOff, Plus, Star } from "lucide-react";
import { OTA_PLATFORMS, SOCIAL_PLATFORMS, otaInfo, socialInfo } from "@/lib/platforms";
import type { OtaPlatform, SocialPlatform } from "@/lib/platforms";
import { BrandIcon } from "@/components/BrandIcon";
import { PERK_ICONS } from "@/components/OtaSection";
import { AddButton, ItemShell, NumberInput, SectionCard, SelectInput, TabHeader, TextArea, TextInput, Toggle, inputCls, labelCls, listOps } from "../fields";
import type { TabProps } from "../fields";

/* ------------------------------------------------------------------ */
/* Book Direct & OTA channels                                          */
/* ------------------------------------------------------------------ */
export function OtaTab({ data, set }: TabProps) {
  const o = data.otaLinks;
  const links = listOps(set, (d) => d.otaLinks.links);
  const perks = listOps(set, (d) => d.otaLinks.perks);
  const used = new Set(o.links.map((l) => l.platform));
  const available = OTA_PLATFORMS.filter((p) => !used.has(p.id));

  return (
    <div className="space-y-6">
      <TabHeader title="Book Direct & Booking Platforms" description="Show your Booking.com, Airbnb and Agoda reputation — while guiding guests to book direct for the best rate." />

      <SectionCard title="Direct booking card">
        <TextInput label="Eyebrow" value={o.eyebrow} onChange={(v) => set((d) => { d.otaLinks.eyebrow = v; })} />
        <TextInput label="Headline" value={o.title} onChange={(v) => set((d) => { d.otaLinks.title = v; })} />
        <TextArea label="Supporting text" value={o.subtitle} onChange={(v) => set((d) => { d.otaLinks.subtitle = v; })} />
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberInput label="Savings vs. OTAs (%)" value={o.savingsPercent} min={0} max={60} onChange={(v) => set((d) => { d.otaLinks.savingsPercent = v; })} hint="Shows a struck-through OTA price" />
          <TextInput label="Primary button" value={o.directCtaText} onChange={(v) => set((d) => { d.otaLinks.directCtaText = v; })} />
          <TextInput label="Secondary button" value={o.secondaryCtaText} onChange={(v) => set((d) => { d.otaLinks.secondaryCtaText = v; })} hint="Opens the concierge chat" />
        </div>
      </SectionCard>

      <SectionCard title="Direct booking perks" description="Benefits guests only receive when booking on your website.">
        {o.perks.map((perk, i) => {
          const Icon = PERK_ICONS[perk.icon] ?? Star;
          return (
            <ItemShell
              key={i}
              title={perk.text || "New perk"}
              index={i}
              total={o.perks.length}
              onMove={(dir) => perks.move(i, dir)}
              onRemove={() => perks.remove(i)}
              leading={<span className="grid h-9 w-9 place-items-center rounded-full bg-[#12232E] text-[#C87D55]"><Icon className="h-4 w-4" /></span>}
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <SelectInput label="Icon" value={perk.icon} onChange={(v) => set((d) => { d.otaLinks.perks[i].icon = v; })} options={Object.keys(PERK_ICONS).map((k) => ({ value: k, label: k }))} />
                <TextInput className="sm:col-span-2" label="Perk" value={perk.text} onChange={(v) => set((d) => { d.otaLinks.perks[i].text = v; })} />
              </div>
            </ItemShell>
          );
        })}
        <AddButton onClick={() => perks.add({ icon: "Gift", text: "Complimentary sunset boat ride" })}>Add perk</AddButton>
      </SectionCard>

      <SectionCard title="Booking platforms" description="Each platform appears as an elegant listing button that opens in a new tab.">
        {o.links.map((link, i) => {
          const info = otaInfo(link.platform);
          return (
            <ItemShell
              key={link.id}
              title={link.name}
              subtitle={link.active && link.url ? "Visible on site" : "Hidden"}
              index={i}
              total={o.links.length}
              onMove={(dir) => links.move(i, dir)}
              onRemove={() => links.remove(i)}
              leading={
                <span className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-black/5" style={{ backgroundColor: info.tile, color: info.ink }}>
                  <BrandIcon glyph={info.glyph} colored={link.platform === "agoda"} className="h-5 w-5" />
                </span>
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectInput
                  label="Platform"
                  value={link.platform}
                  onChange={(v) =>
                    set((d) => {
                      const next = otaInfo(v);
                      d.otaLinks.links[i].platform = v as OtaPlatform;
                      d.otaLinks.links[i].name = next.label;
                      d.otaLinks.links[i].ratingLabel = next.defaultRatingLabel;
                    })
                  }
                  options={OTA_PLATFORMS.filter((p) => p.id === link.platform || !used.has(p.id)).map((p) => ({ value: p.id, label: p.label }))}
                />
                <TextInput label="Display name" value={link.name} onChange={(v) => set((d) => { d.otaLinks.links[i].name = v; })} />
              </div>
              <TextInput label="Listing URL" value={link.url} placeholder={info.placeholder} onChange={(v) => set((d) => { d.otaLinks.links[i].url = v; })} />
              <div className="grid gap-3 sm:grid-cols-3">
                <TextInput label={info.scale === "5" ? "Rating (out of 5)" : "Rating (out of 10)"} value={link.rating} onChange={(v) => set((d) => { d.otaLinks.links[i].rating = v; })} />
                <TextInput label="Rating label" value={link.ratingLabel} onChange={(v) => set((d) => { d.otaLinks.links[i].ratingLabel = v; })} />
                <TextInput label="Review count" value={link.reviewCount} placeholder="e.g. 214" onChange={(v) => set((d) => { d.otaLinks.links[i].reviewCount = v; })} />
              </div>
              <Toggle label="Show on website" checked={link.active} onChange={(v) => set((d) => { d.otaLinks.links[i].active = v; })} />
            </ItemShell>
          );
        })}
        {available.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {available.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => links.add({ id: `ota-${p.id}-${Date.now()}`, platform: p.id, name: p.label, url: "", active: true, rating: "", ratingLabel: p.defaultRatingLabel, reviewCount: "" })}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#12232E]/20 px-3 py-2 text-xs font-semibold text-[#12232E]/75 transition hover:border-[#C87D55] hover:text-[#C87D55]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="grid h-5 w-5 place-items-center rounded-md" style={{ backgroundColor: p.tile, color: p.ink }}>
                  <BrandIcon glyph={p.glyph} colored={p.id === "agoda"} className="h-3 w-3" />
                </span>
                {p.label}
              </button>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Platform panel copy">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Panel title" value={o.panelTitle} onChange={(v) => set((d) => { d.otaLinks.panelTitle = v; })} />
          <TextInput label="Panel subtitle" value={o.panelSubtitle} onChange={(v) => set((d) => { d.otaLinks.panelSubtitle = v; })} />
        </div>
        <TextArea label="Footnote" rows={2} value={o.footnote} onChange={(v) => set((d) => { d.otaLinks.footnote = v; })} />
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer & Social                                                     */
/* ------------------------------------------------------------------ */
export function FooterTab({ data, set }: TabProps) {
  const f = data.footer;
  const socials = listOps(set, (d) => d.footer.socials);
  const used = new Set(f.socials.map((s) => s.platform));
  const available = SOCIAL_PLATFORMS.filter((p) => !used.has(p.id));
  const visible = f.socials.filter((s) => s.active && s.url.trim());

  return (
    <div className="space-y-6">
      <TabHeader title="Footer & Social Media" description="Contact details, newsletter and the social profiles shown in the footer." />

      <SectionCard title="Contact & brand">
        <TextArea label="Brand description" value={f.brandDescription} onChange={(v) => set((d) => { d.footer.brandDescription = v; })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Address" value={f.address} onChange={(v) => set((d) => { d.footer.address = v; })} />
          <TextInput label="Phone / WhatsApp" value={f.phone} onChange={(v) => set((d) => { d.footer.phone = v; })} />
          <TextInput label="Email" type="email" value={f.email} onChange={(v) => set((d) => { d.footer.email = v; })} />
          <TextInput label="Accreditation line" value={f.accreditationText} onChange={(v) => set((d) => { d.footer.accreditationText = v; })} />
        </div>
        <TextInput label="Copyright text" value={f.copyrightText} onChange={(v) => set((d) => { d.footer.copyrightText = v; })} hint="The current year is added automatically." />
      </SectionCard>

      <SectionCard title="Newsletter">
        <Toggle label="Show newsletter sign-up" checked={f.showNewsletter} onChange={(v) => set((d) => { d.footer.showNewsletter = v; })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Title" value={f.newsletterTitle} onChange={(v) => set((d) => { d.footer.newsletterTitle = v; })} />
          <TextInput label="Text" value={f.newsletterText} onChange={(v) => set((d) => { d.footer.newsletterText = v; })} />
        </div>
      </SectionCard>

      <SectionCard title="Legal pages & admin link" description="Shown in the footer's bottom bar next to “© All rights reserved”.">
        <Toggle
          label="Show “Admin” link in the footer"
          hint="If hidden, open the admin by adding /#admin to your website address."
          checked={f.showAdminLink}
          onChange={(v) => set((d) => { d.footer.showAdminLink = v; })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Privacy page title" value={data.legal.privacyTitle} onChange={(v) => set((d) => { d.legal.privacyTitle = v; })} />
          <TextInput label="Terms page title" value={data.legal.termsTitle} onChange={(v) => set((d) => { d.legal.termsTitle = v; })} />
        </div>
        <TextArea label="Privacy policy" rows={8} value={data.legal.privacyBody} onChange={(v) => set((d) => { d.legal.privacyBody = v; })} hint="Separate paragraphs with a blank line. Start a line with “## ” for a heading." />
        <TextArea label="Terms & conditions" rows={8} value={data.legal.termsBody} onChange={(v) => set((d) => { d.legal.termsBody = v; })} hint="Separate paragraphs with a blank line. Start a line with “## ” for a heading." />
      </SectionCard>

      <SectionCard title="Social media profiles" description={`${visible.length} icon${visible.length === 1 ? "" : "s"} visible in the footer · 3–5 keeps it clean and luxurious.`}>
        <div className="flex items-center gap-2.5 rounded-2xl bg-[#12232E] px-5 py-4">
          <span className="mr-2 text-[10px] uppercase tracking-widest text-white/40">Footer preview</span>
          {visible.length === 0 && <span className="text-xs text-white/50">No visible profiles</span>}
          {visible.map((s) => (
            <span key={s.id} className="grid h-9 w-9 place-items-center rounded-full text-white/75 ring-1 ring-white/15">
              <BrandIcon glyph={socialInfo(s.platform).glyph} className="h-4 w-4" />
            </span>
          ))}
        </div>

        {f.socials.map((s, i) => {
          const info = socialInfo(s.platform);
          return (
            <ItemShell
              key={s.id}
              title={info.label}
              subtitle={s.active && s.url.trim() ? "Visible" : s.url.trim() ? "Hidden" : "Add a URL to show"}
              index={i}
              total={f.socials.length}
              onMove={(dir) => socials.move(i, dir)}
              onRemove={() => socials.remove(i)}
              leading={<span className="grid h-9 w-9 place-items-center rounded-full bg-[#12232E] text-white"><BrandIcon glyph={info.glyph} className="h-4 w-4" /></span>}
            >
              <div className="flex items-end gap-2">
                <label className="block flex-1">
                  <span className={labelCls}>Profile URL</span>
                  <input value={s.url} placeholder={info.placeholder} onChange={(e) => set((d) => { d.footer.socials[i].url = e.target.value; })} className={inputCls} />
                </label>
                <button
                  type="button"
                  onClick={() => set((d) => { d.footer.socials[i].active = !d.footer.socials[i].active; })}
                  className={`inline-flex h-[42px] items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition ${s.active ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-[#12232E]/15 text-[#12232E]/60"}`}
                >
                  {s.active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {s.active ? "Shown" : "Hidden"}
                </button>
              </div>
            </ItemShell>
          );
        })}

        {available.length > 0 && (
          <div>
            <span className={labelCls}>Add a platform</span>
            <div className="flex flex-wrap gap-2">
              {available.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => socials.add({ id: `social-${p.id}-${Date.now()}`, platform: p.id as SocialPlatform, url: "", active: true })}
                  className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#12232E]/20 px-3 py-2 text-xs font-semibold text-[#12232E]/75 transition hover:border-[#C87D55] hover:text-[#C87D55]"
                >
                  <BrandIcon glyph={p.glyph} className="h-3.5 w-3.5" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {f.socials.length === 0 && <AddButton onClick={() => socials.add({ id: `social-instagram-${Date.now()}`, platform: "instagram", url: "", active: true })}>Add Instagram</AddButton>}
      </SectionCard>
    </div>
  );
}
