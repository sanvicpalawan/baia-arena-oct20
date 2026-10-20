"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import type { SiteConfig } from "@/lib/siteConfig";
import { SectionHeading } from "./SectionHeading";

interface FaqSectionProps {
  faqData: SiteConfig["faq"];
  onOpenChat: () => void;
}

export function FaqSection({ faqData, onOpenChat }: FaqSectionProps) {
  const categories = ["All", ...Array.from(new Set(faqData.questions.map((q) => q.category).filter(Boolean)))];
  const [category, setCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(faqData.questions[0]?.id ?? null);
  const list = category === "All" ? faqData.questions : faqData.questions.filter((q) => q.category === category);

  return (
    <section id="faq" className="section-y bg-sand">
      <div className="container-x">
        <SectionHeading eyebrow={faqData.badge} title={faqData.title} subtitle={faqData.subtitle} />

        {categories.length > 2 && (
          <div role="tablist" aria-label="Question topics" className="chip-grid mt-12 hidden sm:flex">
            {categories.map((c) => (
              <button key={c} type="button" role="tab" aria-selected={c === category} onClick={() => setCategory(c)} className="chip">
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="mx-auto mt-10 max-w-3xl divide-y sm:mt-8 divide-navy/10 border-y border-navy/10">
          {list.map((q) => {
            const isOpen = openId === q.id;
            return (
              <div key={q.id}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${q.id}`}
                    onClick={() => setOpenId(isOpen ? null : q.id)}
                    className="flex w-full items-start justify-between gap-5 py-5 text-left sm:py-6"
                  >
                    <span>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-terracotta">{q.category}</span>
                      <span className="mt-1.5 block font-serif-luxury text-[1.25rem] leading-snug text-navy sm:text-[1.45rem]">{q.question}</span>
                    </span>
                    <span
                      className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 transition-all duration-500 ${
                        isOpen ? "rotate-45 bg-navy text-sand ring-navy" : "text-navy ring-navy/15"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div id={`faq-panel-${q.id}`} className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-2 text-[15px] font-light leading-relaxed text-ocean sm:pr-14">{q.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-serif-luxury text-2xl text-navy">Still curious?</p>
            <p className="mt-1 text-sm text-ocean">Ask BAIA — our digital concierge answers in seconds, day or night.</p>
          </div>
          <button type="button" onClick={onOpenChat} className="btn btn-outline">
            <Sparkles />
            Ask BAIA
          </button>
        </div>
      </div>
    </section>
  );
}
