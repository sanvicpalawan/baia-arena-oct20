import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
  children?: ReactNode;
}

/** One heading pattern for every section: eyebrow · serif title · supporting line. */
export function SectionHeading({ eyebrow, title, subtitle, align = "center", tone = "light", className = "", children }: SectionHeadingProps) {
  const center = align === "center";
  const dark = tone === "dark";
  return (
    <div className={`flex max-w-3xl flex-col ${center ? "mx-auto items-center text-center" : "items-start text-left"} ${className}`}>
      {eyebrow && <p className={`eyebrow ${center ? "eyebrow-center" : ""}`}>{eyebrow}</p>}
      <h2 className={`h-section mt-4 ${dark ? "text-sand" : ""}`}>{title}</h2>
      {subtitle && <p className={`lead mt-4 max-w-2xl ${dark ? "text-sand/70" : ""}`}>{subtitle}</p>}
      {children}
    </div>
  );
}
