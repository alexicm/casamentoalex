import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Alex & Paloma · 20.12.2026",
  description:
    "Você faz parte da nossa história. Confirme presença no casamento de Alex e Paloma, no dia 20 de dezembro de 2026.",
  applicationName: "Alex & Paloma",
  authors: [{ name: "Alex & Paloma" }],
  openGraph: {
    title: "Alex & Paloma · 20.12.2026",
    description:
      "Um convite para celebrar com a gente em Brasília, a partir das 17h.",
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
      className={`${cormorant.variable} ${dmSans.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
