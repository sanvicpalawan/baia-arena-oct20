import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSiteConfig } from "@/lib/getSiteConfig";
import type { SiteConfig } from "@/lib/siteConfig";
import { ThemeStyles } from "@/components/ThemeStyles";
import { BaiaLogo } from "@/components/BaiaLogo";

export const dynamic = "force-dynamic";

type Slug = "privacy" | "terms";
type Params = { params: Promise<{ slug: string }> };

function pick(config: SiteConfig, slug: Slug) {
  return slug === "privacy"
    ? { title: config.legal.privacyTitle, body: config.legal.privacyBody }
    : { title: config.legal.termsTitle, body: config.legal.termsBody };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "privacy" && slug !== "terms") return {};
  const config = await getSiteConfig();
  return { title: `${pick(config, slug).title} | BAIA Palawan` };
}

export default async function LegalPage({ params }: Params) {
  const { slug } = await params;
  if (slug !== "privacy" && slug !== "terms") notFound();
  const config = await getSiteConfig();
  const { title, body } = pick(config, slug);
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <main className="min-h-screen bg-sand text-navy">
      <ThemeStyles theme={config.theme} />
      <header className="border-b border-navy/10">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <Link href="/" aria-label="Back to BAIA Palawan">
            <BaiaLogo layout={config.brand.headerLogoVariant} tone="dark" brand={config.brand} textured={false} className="h-12 sm:h-14" />
          </Link>
          <Link href="/" className="btn btn-sm btn-outline">
            <ArrowLeft />
            Back to site
          </Link>
        </div>
      </header>

      <article className="container-x max-w-3xl py-16 sm:py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="h-section mt-4">{title}</h1>
        <div className="mt-10 space-y-5 text-[15px] font-light leading-relaxed text-ocean">
          {blocks.map((block, i) =>
            block.startsWith("## ") ? (
              <h2 key={i} className="pt-4 font-serif-luxury text-2xl font-normal text-navy">
                {block.slice(3)}
              </h2>
            ) : (
              <p key={i} className="whitespace-pre-line">
                {block}
              </p>
            )
          )}
        </div>
      </article>

      <footer className="border-t border-navy/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-ocean sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {config.footer.copyrightText}
          </p>
          <nav className="flex gap-5">
            <Link href="/legal/privacy" className="hover:text-navy">
              {config.legal.privacyTitle}
            </Link>
            <Link href="/legal/terms" className="hover:text-navy">
              {config.legal.termsTitle}
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
