import type { Metadata } from "next";
import { PACKAGES } from "@/lib/packages";
import { PackageSuggester } from "@/components/packages/PackageSuggester";
import { PackageCard } from "@/components/packages/PackageCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Event Packages | Shoboji Social Hall",
  description:
    "Find the perfect event package for your celebration at Shoboji Social Hall. From intimate gatherings to grand galas, we have a package for every occasion.",
};

interface PackagesPageProps {
  searchParams: Promise<{
    guests?: string;
    type?: string;
  }>;
}

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
  const params = await searchParams;
  const initialGuests = params.guests ? Number(params.guests) : undefined;
  const initialEventType = params.type || undefined;

  return (
    <div className="min-h-screen">
      {/* Package Suggester Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-700">
              Find Your Perfect Package
            </p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Tell us about your event
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Enter your guest count and event type. We will recommend the right
              package instantly.
            </p>
          </div>
          <PackageSuggester
            initialGuests={initialGuests}
            initialEventType={initialEventType}
          />
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-stone-200" />
          <span className="text-sm font-medium text-stone-400">or browse all packages</span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>
      </div>

      {/* All Packages Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            All Event Packages
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} compact />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-700 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white">
            Need something different?
          </h2>
          <p className="mt-3 text-stone-200">
            Our packages are starting points. Build a fully custom booking with
            any combination of equipment, catering, and services.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-navy-700 transition-colors hover:bg-stone-100"
            >
              Build Custom Booking
            </Link>
            <Link
              href="/availability"
              className="rounded-lg border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Check Available Dates
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
