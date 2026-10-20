import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BAIA Palawan | Beachfront Boutique Lodge — San Vicente, Palawan",
  description:
    "An exclusive 3-cottage beachfront haven in Sitio Panindigan, San Vicente, Palawan. Quiet luxury, calm turquoise waters and deep relaxation away from the crowds.",
  openGraph: {
    title: "BAIA Palawan — Beachfront Boutique Lodge",
    description: "Private beachfront luxury in paradise. A mini sanctuary for inner work & reflection.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#12232E",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="bg-sand text-navy antialiased">{children}</body>
    </html>
  );
}
