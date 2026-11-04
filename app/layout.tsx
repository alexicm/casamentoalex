import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces, Pinyon_Script } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-script",
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Alex & Paloma · 20.12.2026",
  description:
    "Mais do que um casamento, um encontro. Confirme presença no casamento de Alex e Paloma, 20.12.2026.",
  applicationName: "Alex & Paloma",
  authors: [{ name: "Alex & Paloma" }],
  openGraph: {
    title: "Alex & Paloma · 20.12.2026",
    description:
      "Mais do que um casamento, um encontro. 20.12.2026, Brasília, a partir das 17h30.",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/assets/wedding/save-the-date.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex & Paloma · 20.12.2026",
    images: ["/assets/wedding/save-the-date.jpg"],
  },
  robots: { index: false, follow: false },
  referrer: "strict-origin-when-cross-origin",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#4B1321",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${figtree.variable} ${pinyon.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
