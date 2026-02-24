import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/shared/ConditionalLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shoboji Social Hall | Event Venue & Hall Rentals \u00B7 Honolulu, Hawaii",
  description:
    "Honolulu's premier social hall for weddings, receptions, corporate events, and community gatherings. Up to 450+ guests, full AV equipment, and in-house catering by Nu'uanu Cookhouse.",
  keywords: [
    "event venue Honolulu",
    "hall rental Hawaii",
    "wedding venue Honolulu",
    "reception hall Hawaii",
    "Shoboji Social Hall",
    "banquet hall Honolulu",
    "corporate event venue Hawaii",
    "Nu'uanu event space",
    "Horiuchi Pacific",
  ],
  openGraph: {
    title: "Shoboji Social Hall \u00B7 Honolulu Event Venue",
    description:
      "Premier event venue in Honolulu for weddings, receptions, and celebrations. Up to 450+ guests with full AV and in-house catering.",
    type: "website",
    siteName: "Shoboji Social Hall",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shoboji Social Hall \u00B7 Honolulu Event Venue",
    description:
      "Premier event venue in Honolulu for weddings, receptions, and celebrations. Up to 450+ guests with full AV and in-house catering.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
