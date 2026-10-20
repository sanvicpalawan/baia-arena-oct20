"use client";

import { useState } from "react";
import { Star, Trash2, UtensilsCrossed } from "lucide-react";
import {
  AddButton, IconButton, ImageField, ItemShell, LinesInput, NumberInput, SectionCard, SelectInput,
  TabHeader, TextArea, TextInput, Toggle, UploadButton, inputCls, labelCls, listOps,
} from "../fields";
import type { TabProps } from "../fields";

const SAMPLE_IMAGE = "https://images.pexels.com/photos/36758179/pexels-photo-36758179.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200";
const ANCHORS = ["#about", "#accommodations", "#book-direct", "#dining", "#experiences", "#faq", "#reviews", "#location"];

/* Header & navigation ------------------------------------------------ */
export function HeaderTab({ data, set }: TabProps) {
  const h = data.header;
  const nav = listOps(set, (d) => d.header.navLinks);
  return (
    <div className="space-y-6">
      <TabHeader title="Header & Navigation" description="Call-to-action, availability badge and the menu (the menu is reused in the footer)." />
      <SectionCard title="Header">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Brand name (screen readers)" value={h.logoTitle} onChange={(v) => set((d) => { d.header.logoTitle = v; })} />
          <TextInput label="Brand location" value={h.logoSubtitle} onChange={(v) => set((d) => { d.header.logoSubtitle = v; })} />
          <TextInput label="Button text" value={h.ctaText} onChange={(v) => set((d) => { d.header.ctaText = v; })} />
          <TextInput label="Availability badge" value={h.cottageBadgeText} onChange={(v) => set((d) => { d.header.cottageBadgeText = v; })} />
        </div>
        <Toggle label="Show availability badge after scrolling past the hero" checked={h.showCottageBadge} onChange={(v) => set((d) => { d.header.showCottageBadge = v; })} />
      </SectionCard>
      <SectionCard title="Menu links" description="Use #section anchors to scroll, or full URLs for external pages.">
        <datalist id="baia-anchors">{ANCHORS.map((a) => <option key={a} value={a} />)}</datalist>
        {h.navLinks.map((l, i) => (
          <ItemShell key={i} title={l.name || "Untitled link"} subtitle={l.href} index={i} total={h.navLinks.length} onMove={(dir) => nav.move(i, dir)} onRemove={() => nav.remove(i)}>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Label" value={l.name} onChange={(v) => set((d) => { d.header.navLinks[i].name = v; })} />
              <label className="block">
                <span className={labelCls}>Link</span>
                <input list="baia-anchors" value={l.href} onChange={(e) => set((d) => { d.header.navLinks[i].href = e.target.value; })} className={inputCls} />
              </label>
            </div>
          </ItemShell>
        ))}
        <AddButton onClick={() => nav.add({ name: "Book Direct", href: "#book-direct" })}>Add menu link</AddButton>
      </SectionCard>
    </div>
  );
}

/* Hero ---------------------------------------------------------------- */
export function HeroTab({ data, set, passkey }: TabProps) {
  const h = data.hero;
  const media = listOps(set, (d) => d.hero.backgroundMedia);
  return (
    <div className="space-y-6">
      <TabHeader title="Hero & Media" description="Full-screen imagery or video from your device, headline typography and booking bar." />
      <SectionCard
        title="Background slides"
        description="Images and videos rotate automatically. MP4 / WEBM / MOV supported."
        actions={<UploadButton passkey={passkey} accept="image/*,video/*" label="Upload image or video" onUploaded={(url, type) => set((d) => { d.hero.backgroundMedia.unshift({ type, url, caption: "Sitio Panindigan, Palawan" }); })} />}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {h.backgroundMedia.map((m, i) => (
            <ItemShell key={`${m.url}-${i}`} title={`Slide ${i + 1}`} subtitle={m.type === "video" ? "Video" : "Image"} index={i} total={h.backgroundMedia.length} onMove={(dir) => media.move(i, dir)} onRemove={() => media.remove(i)}>
              <div className="aspect-video overflow-hidden rounded-xl bg-black">
                {m.type === "video" ? (
                  <video src={m.url} muted playsInline loop autoPlay className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <TextInput label="Caption" value={m.caption} onChange={(v) => set((d) => { d.hero.backgroundMedia[i].caption = v; })} />
              <div className="grid gap-3 sm:grid-cols-3">
                <TextInput className="sm:col-span-2" label="Media URL" value={m.url} onChange={(v) => set((d) => { d.hero.backgroundMedia[i].url = v; })} />
                <SelectInput label="Type" value={m.type} onChange={(v) => set((d) => { d.hero.backgroundMedia[i].type = v === "video" ? "video" : "image"; })} options={[{ value: "image", label: "Image" }, { value: "video", label: "Video" }]} />
              </div>
            </ItemShell>
          ))}
        </div>
        <AddButton onClick={() => media.add({ type: "image", url: SAMPLE_IMAGE, caption: "New slide" })}>Add slide by URL</AddButton>
      </SectionCard>
      <SectionCard title="Headline & copy">
        <TextInput label="Tagline" value={h.tagline} onChange={(v) => set((d) => { d.hero.tagline = v; })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Title — line 1" value={h.titleLine1} onChange={(v) => set((d) => { d.hero.titleLine1 = v; })} />
          <TextInput label="Title — line 2 (italic)" value={h.titleLine2} onChange={(v) => set((d) => { d.hero.titleLine2 = v; })} />
        </div>
        <TextArea label="Intro paragraph" value={h.subtitle} onChange={(v) => set((d) => { d.hero.subtitle = v; })} />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextInput label="Guest rating" value={h.ratingScore} onChange={(v) => set((d) => { d.hero.ratingScore = v; })} />
          <TextInput label="Location score" value={h.locationScore} onChange={(v) => set((d) => { d.hero.locationScore = v; })} />
          <TextInput label="Booking bar button" value={h.ctaBookingText} onChange={(v) => set((d) => { d.hero.ctaBookingText = v; })} />
        </div>
        <Toggle label="Show direct-booking perks line" checked={h.showDirectBookingPerks} onChange={(v) => set((d) => { d.hero.showDirectBookingPerks = v; })} />
        <TextInput label="Direct-booking perks line" value={h.directBookingPerksText} onChange={(v) => set((d) => { d.hero.directBookingPerksText = v; })} />
      </SectionCard>
    </div>
  );
}

/* About ---------------------------------------------------------------- */
export function AboutTab({ data, set, passkey }: TabProps) {
  const a = data.about;
  const hl = listOps(set, (d) => d.about.highlights);
  return (
    <div className="space-y-6">
      <TabHeader title="About BAIA" description="The story of the lodge, parallax imagery and highlight badges." />
      <SectionCard title="Story">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Badge" value={a.badge} onChange={(v) => set((d) => { d.about.badge = v; })} />
          <TextInput label="Eyebrow" value={a.subheadline} onChange={(v) => set((d) => { d.about.subheadline = v; })} />
        </div>
        <TextInput label="Headline" value={a.headline} onChange={(v) => set((d) => { d.about.headline = v; })} />
        <TextArea label="Paragraph 1" rows={4} value={a.paragraph1} onChange={(v) => set((d) => { d.about.paragraph1 = v; })} />
        <TextArea label="Paragraph 2" rows={4} value={a.paragraph2} onChange={(v) => set((d) => { d.about.paragraph2 = v; })} />
        <TextArea label="Pull quote" rows={2} value={a.quote} onChange={(v) => set((d) => { d.about.quote = v; })} />
      </SectionCard>
      <SectionCard title="Imagery">
        <div className="grid gap-4 lg:grid-cols-2">
          <ImageField passkey={passkey} label="Tall parallax image" value={a.imageTall} onChange={(v) => set((d) => { d.about.imageTall = v; })} />
          <ImageField passkey={passkey} label="Overlapping detail image" value={a.imageSecondary} onChange={(v) => set((d) => { d.about.imageSecondary = v; })} />
        </div>
      </SectionCard>
      <SectionCard title="Highlight badges">
        {a.highlights.map((item, i) => (
          <ItemShell key={i} title={item.title || "Highlight"} index={i} total={a.highlights.length} onMove={(dir) => hl.move(i, dir)} onRemove={() => hl.remove(i)}>
            <div className="grid gap-3 sm:grid-cols-4">
              <TextInput className="sm:col-span-2" label="Title" value={item.title} onChange={(v) => set((d) => { d.about.highlights[i].title = v; })} />
              <SelectInput label="Icon" value={item.icon} onChange={(v) => set((d) => { d.about.highlights[i].icon = v; })} options={["Waves", "Anchor", "BedDouble", "Utensils"].map((x) => ({ value: x, label: x }))} />
            </div>
            <TextInput label="Description" value={item.desc} onChange={(v) => set((d) => { d.about.highlights[i].desc = v; })} />
          </ItemShell>
        ))}
        <AddButton onClick={() => hl.add({ title: "New highlight", desc: "Short supporting line", icon: "Waves" })}>Add highlight</AddButton>
      </SectionCard>
    </div>
  );
}

/* Rooms ---------------------------------------------------------------- */
function AddImageByUrl({ onAdd }: { onAdd: (url: string) => void }) {
  const [url, setUrl] = useState("");
  return (
    <span className="flex flex-1 gap-2">
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or paste an image URL" className={`${inputCls} py-2 text-xs`} />
      <button type="button" disabled={!url.trim()} onClick={() => { onAdd(url.trim()); setUrl(""); }} className="shrink-0 rounded-xl border border-[#12232E]/15 px-3 text-xs font-semibold text-[#12232E] hover:bg-[#12232E]/5 disabled:opacity-40">
        Add
      </button>
    </span>
  );
}

export function RoomsTab({ data, set, passkey }: TabProps) {
  const a = data.accommodations;
  const rooms = listOps(set, (d) => d.accommodations.rooms);
  return (
    <div className="space-y-6">
      <TabHeader title="Cottages & Rooms" description="Names, nightly rates, photos and amenities. Rates feed the booking form and the 'from' price automatically." />
      <SectionCard title="Section text">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Badge" value={a.badge} onChange={(v) => set((d) => { d.accommodations.badge = v; })} />
          <TextInput label="Title" value={a.title} onChange={(v) => set((d) => { d.accommodations.title = v; })} />
        </div>
        <TextArea label="Subtitle" rows={2} value={a.subtitle} onChange={(v) => set((d) => { d.accommodations.subtitle = v; })} />
      </SectionCard>

      <SectionCard title="Cottages" description={`${a.rooms.filter((r) => r.active).length} bookable · ${a.rooms.length} total`}>
        {a.rooms.map((r, i) => (
          <ItemShell key={r.id} title={r.name} subtitle={`$${r.pricePerNight} / night · ${r.active ? "Bookable" : "Hidden"}`} index={i} total={a.rooms.length} onMove={(dir) => rooms.move(i, dir)} onRemove={() => rooms.remove(i)}>
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput label="Name" value={r.name} onChange={(v) => set((d) => { d.accommodations.rooms[i].name = v; })} />
              <TextInput label="Subtitle" value={r.subtitle} onChange={(v) => set((d) => { d.accommodations.rooms[i].subtitle = v; })} />
              <TextInput label="Tag" value={r.tag} onChange={(v) => set((d) => { d.accommodations.rooms[i].tag = v; })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <NumberInput label="Rate / night (USD)" value={r.pricePerNight} min={0} onChange={(v) => set((d) => { d.accommodations.rooms[i].pricePerNight = v; })} />
              <NumberInput label="Size (m²)" value={r.sqm} min={0} onChange={(v) => set((d) => { d.accommodations.rooms[i].sqm = v; })} />
              <TextInput label="Occupancy" value={r.occupancy} onChange={(v) => set((d) => { d.accommodations.rooms[i].occupancy = v; })} />
              <NumberInput label="Rating" value={r.rating} step={0.1} min={0} max={10} onChange={(v) => set((d) => { d.accommodations.rooms[i].rating = v; })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Bedding" value={r.bed} onChange={(v) => set((d) => { d.accommodations.rooms[i].bed = v; })} />
              <TextInput label="View" value={r.view} onChange={(v) => set((d) => { d.accommodations.rooms[i].view = v; })} />
            </div>
            <TextArea label="Description" rows={3} value={r.description} onChange={(v) => set((d) => { d.accommodations.rooms[i].description = v; })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <LinesInput label="Card highlights" value={r.highlights} onChange={(v) => set((d) => { d.accommodations.rooms[i].highlights = v; })} />
              <LinesInput label="Full amenities" value={r.amenities} onChange={(v) => set((d) => { d.accommodations.rooms[i].amenities = v; })} />
            </div>
            <div>
              <span className={labelCls}>Photos · first photo is the cover</span>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {r.images.map((img, j) => (
                  <div key={`${img}-${j}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#12232E]/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    {j === 0 ? (
                      <span className="absolute left-1.5 top-1.5 rounded-md bg-[#12232E]/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">Cover</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => set((d) => { const imgs = d.accommodations.rooms[i].images; const [x] = imgs.splice(j, 1); imgs.unshift(x); })}
                        className="absolute left-1.5 top-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#12232E] opacity-0 transition group-hover:opacity-100"
                      >
                        Make cover
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => set((d) => { d.accommodations.rooms[i].images.splice(j, 1); })}
                      className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-rose-600 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <UploadButton passkey={passkey} label="Upload photo" onUploaded={(url) => set((d) => { d.accommodations.rooms[i].images.push(url); })} />
                <AddImageByUrl onAdd={(url) => set((d) => { d.accommodations.rooms[i].images.push(url); })} />
              </div>
            </div>
            <Toggle label="Bookable & visible on the website" checked={r.active} onChange={(v) => set((d) => { d.accommodations.rooms[i].active = v; })} />
          </ItemShell>
        ))}
        <AddButton
          onClick={() =>
            rooms.add({
              id: `room-${Date.now()}`,
              name: "New Cottage",
              subtitle: "Describe the view and the feeling",
              tag: "New",
              pricePerNight: 250,
              currency: "USD",
              sqm: 40,
              occupancy: "2 Guests",
              bed: "King Bed",
              view: "Sea view",
              rating: 9.5,
              images: [SAMPLE_IMAGE],
              description: "A calm, light-filled cottage steps from the turquoise water.",
              amenities: ["Air-conditioning", "Private terrace", "Breakfast included"],
              highlights: ["King Bed", "Sea View"],
              active: true,
            })
          }
        >
          Add cottage
        </AddButton>
      </SectionCard>
    </div>
  );
}

/* Dining --------------------------------------------------------------- */
export function DiningTab({ data, set, passkey }: TabProps) {
  const dn = data.dining;
  const menus = listOps(set, (d) => d.dining.menus);
  return (
    <div className="space-y-6">
      <TabHeader title="Dining & Menus" description="Create as many menus as you like — breakfast, dinner, bar, beach BBQ, private dining — each with its own dishes." />
      <SectionCard title="Section text">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Badge" value={dn.badge} onChange={(v) => set((d) => { d.dining.badge = v; })} />
          <TextInput label="Title" value={dn.title} onChange={(v) => set((d) => { d.dining.title = v; })} />
        </div>
        <TextArea label="Subtitle" rows={2} value={dn.subtitle} onChange={(v) => set((d) => { d.dining.subtitle = v; })} />
      </SectionCard>

      {dn.menus.map((m, mi) => {
        const dishes = listOps(set, (d) => d.dining.menus[mi].dishes);
        return (
          <ItemShell
            key={m.id}
            title={m.name}
            subtitle={`${m.dishes.length} dishes · ${m.hours}`}
            index={mi}
            total={dn.menus.length}
            onMove={(dir) => menus.move(mi, dir)}
            onRemove={() => menus.remove(mi)}
            leading={<span className="grid h-9 w-9 place-items-center rounded-full bg-[#12232E] text-[#C87D55]"><UtensilsCrossed className="h-4 w-4" /></span>}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput label="Menu name" value={m.name} onChange={(v) => set((d) => { d.dining.menus[mi].name = v; })} />
              <TextInput label="Hours" value={m.hours} onChange={(v) => set((d) => { d.dining.menus[mi].hours = v; })} />
              <TextInput label="Tagline" value={m.tagline} onChange={(v) => set((d) => { d.dining.menus[mi].tagline = v; })} />
            </div>
            <TextArea label="Description" rows={2} value={m.description} onChange={(v) => set((d) => { d.dining.menus[mi].description = v; })} />
            <ImageField passkey={passkey} label="Menu photo" value={m.image} onChange={(v) => set((d) => { d.dining.menus[mi].image = v; })} />
            <div>
              <span className={labelCls}>Dishes</span>
              <div className="space-y-2">
                {m.dishes.map((dish, di) => (
                  <div key={di} className="rounded-xl border border-[#12232E]/10 bg-white p-3">
                    <div className="grid gap-2 sm:grid-cols-12">
                      <input value={dish.name} onChange={(e) => set((d) => { d.dining.menus[mi].dishes[di].name = e.target.value; })} placeholder="Dish name" className={`${inputCls} sm:col-span-5`} />
                      <input value={dish.price} onChange={(e) => set((d) => { d.dining.menus[mi].dishes[di].price = e.target.value; })} placeholder="Price" className={`${inputCls} sm:col-span-2`} />
                      <input value={dish.tag ?? ""} onChange={(e) => set((d) => { d.dining.menus[mi].dishes[di].tag = e.target.value; })} placeholder="Tag (optional)" className={`${inputCls} sm:col-span-3`} />
                      <div className="flex items-center justify-end gap-1 sm:col-span-2">
                        <IconButton label="Move up" disabled={di === 0} onClick={() => dishes.move(di, -1)}><span className="text-xs">↑</span></IconButton>
                        <IconButton label="Move down" disabled={di === m.dishes.length - 1} onClick={() => dishes.move(di, 1)}><span className="text-xs">↓</span></IconButton>
                        <IconButton label="Remove dish" danger onClick={() => dishes.remove(di)}><Trash2 className="h-3.5 w-3.5" /></IconButton>
                      </div>
                    </div>
                    <input value={dish.description} onChange={(e) => set((d) => { d.dining.menus[mi].dishes[di].description = e.target.value; })} placeholder="Ingredients & preparation" className={`${inputCls} mt-2`} />
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <AddButton onClick={() => dishes.add({ name: "New dish", description: "Fresh seasonal ingredients", price: "$20", tag: "" })}>Add dish</AddButton>
              </div>
            </div>
          </ItemShell>
        );
      })}
      <AddButton
        onClick={() =>
          menus.add({
            id: `menu-${Date.now()}`,
            name: "Beach BBQ Night",
            tagline: "Served barefoot on the sand under the stars",
            hours: "18:30 - 22:00",
            description: "Charcoal-grilled catch of the day, island salads and tropical desserts.",
            image: "https://images.pexels.com/photos/8753680/pexels-photo-8753680.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
            dishes: [{ name: "Grilled Catch of the Day", description: "Calamansi, garlic butter, charred lemon", price: "$26", tag: "Signature" }],
          })
        }
      >
        Add new menu
      </AddButton>
    </div>
  );
}

/* Experiences ---------------------------------------------------------- */
export function ExperiencesTab({ data, set, passkey }: TabProps) {
  const e = data.experiences;
  const items = listOps(set, (d) => d.experiences.items);
  return (
    <div className="space-y-6">
      <TabHeader title="Experiences & Amenities" description="The interactive tabs: water, dining, wellness, conveniences — or anything you add." />
      <SectionCard title="Section text">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Badge" value={e.badge} onChange={(v) => set((d) => { d.experiences.badge = v; })} />
          <TextInput label="Title" value={e.title} onChange={(v) => set((d) => { d.experiences.title = v; })} />
        </div>
        <TextArea label="Subtitle" rows={2} value={e.subtitle} onChange={(v) => set((d) => { d.experiences.subtitle = v; })} />
      </SectionCard>
      <SectionCard title="Experience tabs">
        {e.items.map((it, i) => (
          <ItemShell key={it.id} title={it.tabTitle} subtitle={it.badge} index={i} total={e.items.length} onMove={(dir) => items.move(i, dir)} onRemove={() => items.remove(i)}>
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput label="Tab title" value={it.tabTitle} onChange={(v) => set((d) => { d.experiences.items[i].tabTitle = v; })} />
              <TextInput label="Badge" value={it.badge} onChange={(v) => set((d) => { d.experiences.items[i].badge = v; })} />
              <TextInput label="Image caption" value={it.tagline} onChange={(v) => set((d) => { d.experiences.items[i].tagline = v; })} />
            </div>
            <TextInput label="Headline" value={it.headline} onChange={(v) => set((d) => { d.experiences.items[i].headline = v; })} />
            <TextArea label="Description" rows={3} value={it.description} onChange={(v) => set((d) => { d.experiences.items[i].description = v; })} />
            <LinesInput label="Feature points" value={it.features} onChange={(v) => set((d) => { d.experiences.items[i].features = v; })} />
            <ImageField passkey={passkey} label="Image" value={it.image} onChange={(v) => set((d) => { d.experiences.items[i].image = v; })} />
          </ItemShell>
        ))}
        <AddButton onClick={() => items.add({ id: `exp-${Date.now()}`, tabTitle: "New Experience", tagline: "Sitio Panindigan", headline: "A new way to spend a slow day", description: "Describe the experience.", image: SAMPLE_IMAGE, badge: "Curated", features: ["Feature one", "Feature two"] })}>Add experience</AddButton>
      </SectionCard>
    </div>
  );
}

/* FAQ ------------------------------------------------------------------ */
export function FaqTab({ data, set }: TabProps) {
  const f = data.faq;
  const qs = listOps(set, (d) => d.faq.questions);
  return (
    <div className="space-y-6">
      <TabHeader title="Frequently Asked Questions" description="Questions are grouped by category on the website and also help the concierge chat." />
      <SectionCard title="Section text">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Badge" value={f.badge} onChange={(v) => set((d) => { d.faq.badge = v; })} />
          <TextInput label="Title" value={f.title} onChange={(v) => set((d) => { d.faq.title = v; })} />
        </div>
        <TextArea label="Subtitle" rows={2} value={f.subtitle} onChange={(v) => set((d) => { d.faq.subtitle = v; })} />
      </SectionCard>
      <SectionCard title={`Questions (${f.questions.length})`}>
        {f.questions.map((q, i) => (
          <ItemShell key={q.id} title={q.question || "New question"} subtitle={q.category} index={i} total={f.questions.length} onMove={(dir) => qs.move(i, dir)} onRemove={() => qs.remove(i)}>
            <div className="grid gap-3 sm:grid-cols-4">
              <TextInput label="Category" value={q.category} onChange={(v) => set((d) => { d.faq.questions[i].category = v; })} />
              <TextInput className="sm:col-span-3" label="Question" value={q.question} onChange={(v) => set((d) => { d.faq.questions[i].question = v; })} />
            </div>
            <TextArea label="Answer" rows={3} value={q.answer} onChange={(v) => set((d) => { d.faq.questions[i].answer = v; })} />
          </ItemShell>
        ))}
        <AddButton onClick={() => qs.add({ id: `faq-${Date.now()}`, category: "Stay", question: "New guest question?", answer: "A clear, reassuring answer." })}>Add question</AddButton>
      </SectionCard>
    </div>
  );
}

/* Reviews ------------------------------------------------------------- */
export function ReviewsTab({ data, set, passkey }: TabProps) {
  const r = data.reviews;
  const items = listOps(set, (d) => d.reviews.items);
  return (
    <div className="space-y-6">
      <TabHeader title="Guest Reviews" description="Testimonials shown in the scrolling marquee." />
      <SectionCard title="Section text">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Badge" value={r.badge} onChange={(v) => set((d) => { d.reviews.badge = v; })} />
          <TextInput label="Title" value={r.title} onChange={(v) => set((d) => { d.reviews.title = v; })} />
          <TextInput label="Overall score" value={r.ratingScore} onChange={(v) => set((d) => { d.reviews.ratingScore = v; })} />
          <TextInput label="Score caption" value={r.ratingText} onChange={(v) => set((d) => { d.reviews.ratingText = v; })} />
        </div>
      </SectionCard>
      <SectionCard title={`Reviews (${r.items.length})`}>
        {r.items.map((rev, i) => (
          <ItemShell
            key={rev.id}
            title={`${rev.name} · ${rev.location}`}
            subtitle={rev.title}
            index={i}
            total={r.items.length}
            onMove={(dir) => items.move(i, dir)}
            onRemove={() => items.remove(i)}
            leading={<span className="inline-flex items-center gap-1 rounded-lg bg-[#12232E] px-2 py-1 text-[11px] font-bold text-white"><Star className="h-3 w-3 fill-[#C87D55] text-[#C87D55]" />{rev.rating}</span>}
          >
            <div className="grid gap-3 sm:grid-cols-4">
              <TextInput label="Guest name" value={rev.name} onChange={(v) => set((d) => { d.reviews.items[i].name = v; })} />
              <TextInput label="Country" value={rev.location} onChange={(v) => set((d) => { d.reviews.items[i].location = v; })} />
              <NumberInput label="Rating /10" value={rev.rating} step={0.1} min={0} max={10} onChange={(v) => set((d) => { d.reviews.items[i].rating = v; })} />
              <TextInput label="Date" value={rev.date} onChange={(v) => set((d) => { d.reviews.items[i].date = v; })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Headline" value={rev.title} onChange={(v) => set((d) => { d.reviews.items[i].title = v; })} />
              <TextInput label="Stay type" value={rev.stayType} onChange={(v) => set((d) => { d.reviews.items[i].stayType = v; })} />
            </div>
            <TextArea label="Review" rows={3} value={rev.quote} onChange={(v) => set((d) => { d.reviews.items[i].quote = v; })} />
            <ImageField passkey={passkey} label="Guest photo (optional)" value={rev.avatar} onChange={(v) => set((d) => { d.reviews.items[i].avatar = v; })} />
          </ItemShell>
        ))}
        <AddButton onClick={() => items.add({ id: Date.now(), name: "Guest", location: "Country", rating: 10, title: "A wonderful stay", date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }), stayType: "Couple • Deluxe Suite", quote: "Write the guest's words here.", avatar: "" })}>Add review</AddButton>
      </SectionCard>
    </div>
  );
}
