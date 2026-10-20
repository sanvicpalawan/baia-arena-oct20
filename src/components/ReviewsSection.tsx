"use client";

import { Star } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { SectionHeading } from "./SectionHeading";

export function ReviewsSection({ reviewsData }: { reviewsData: SiteConfig["reviews"] }) {
  const items = reviewsData.items;
  if (items.length === 0) return null;
  const loop = [...items, ...items];

  return (
    <section id="reviews" className="section-y overflow-hidden bg-shell">
      <div className="container-x">
        <SectionHeading eyebrow={reviewsData.badge} title={reviewsData.title}>
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-full bg-white px-4 py-2 ring-1 ring-navy/[0.08]">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
              <Star className="h-4 w-4 fill-terracotta text-terracotta" />
              {reviewsData.ratingScore}
            </span>
            <span className="h-4 w-px bg-navy/15" />
            <span className="text-xs text-ocean">{reviewsData.ratingText}</span>
          </div>
        </SectionHeading>
      </div>

      <div className="relative mt-12 sm:mt-16 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="animate-marquee gap-4 pr-4 sm:gap-6 sm:pr-6" style={{ animationDuration: `${Math.max(30, items.length * 10)}s` }}>
          {loop.map((rev, i) => (
            <figure
              key={`${rev.id}-${i}`}
              aria-hidden={i >= items.length ? true : undefined}
              className="flex w-[288px] shrink-0 flex-col justify-between rounded-[1.75rem] bg-white p-6 ring-1 ring-navy/[0.07] sm:w-[380px] sm:p-8"
            >
              <div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-terracotta text-terracotta" />
                  ))}
                  <span className="ml-2 text-xs font-semibold text-navy">{Number(rev.rating).toFixed(1)}</span>
                </div>
                <blockquote className="mt-5">
                  <p className="font-serif-luxury text-[1.3rem] leading-snug text-navy">&ldquo;{rev.title}&rdquo;</p>
                  <p className="mt-3 line-clamp-5 text-[13px] font-light leading-relaxed text-ocean">{rev.quote}</p>
                </blockquote>
              </div>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-navy/[0.07] pt-5">
                {rev.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={rev.avatar} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-navy font-serif-luxury text-sm text-sand">{rev.name.charAt(0)}</span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-navy">{rev.name}</span>
                  <span className="block truncate text-[11px] text-ocean">
                    {rev.location} · {rev.stayType.split("•")[0].trim()}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
