import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check Availability | Shoboji Social Hall',
  description: 'Check available dates for your event at Shoboji Social Hall.',
};

export default function AvailabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
