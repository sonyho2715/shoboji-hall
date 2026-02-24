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
  title: "Shoboji Social Hall | Event Venue in Honolulu, Hawaii",
  description:
    "Book the Shoboji Social Hall for weddings, receptions, celebrations, and community events. Flexible seating for up to 450+ guests with full AV equipment in Honolulu, Hawaii.",
  keywords: [
    "event venue",
    "Honolulu",
    "Hawaii",
    "social hall",
    "wedding venue",
    "reception hall",
    "Shoboji",
    "temple hall",
  ],
  openGraph: {
    title: "Shoboji Social Hall | Event Venue in Honolulu, Hawaii",
    description:
      "Book the Shoboji Social Hall for weddings, receptions, celebrations, and community events in Honolulu.",
    type: "website",
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
