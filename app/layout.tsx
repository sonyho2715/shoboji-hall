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
  title: "Shoboji Social Hall | Facility Rentals in Honolulu, Hawaii",
  description:
    "Book the Shoboji Social Hall for your special event. Flexible rental packages for members and non-members. Weddings, receptions, memorials, and community gatherings in Honolulu.",
  keywords: [
    "event venue",
    "Honolulu",
    "Hawaii",
    "social hall",
    "wedding venue",
    "reception hall",
    "Shoboji",
    "temple hall",
    "facility rental",
    "community event",
  ],
  openGraph: {
    title: "Shoboji Social Hall | Facility Rentals",
    description:
      "Book the Shoboji Social Hall for your special event. Flexible rental packages for members and non-members.",
    type: "website",
    siteName: "Shoboji Social Hall",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shoboji Social Hall | Facility Rentals",
    description:
      "Book the Shoboji Social Hall for your special event in Honolulu, Hawaii.",
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
