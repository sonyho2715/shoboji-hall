import Link from "next/link";
import Image from "next/image";
import { PackageSuggester } from "@/components/packages/PackageSuggester";
import { ParallaxHero } from "@/components/shared/ParallaxHero";

export const dynamic = "force-dynamic";

interface TierData {
  id: number;
  tierName: string;
  hallBaseRate: string;
  hallHourlyRate: string;
  eventSupportBase: string;
  securityDeposit: string;
}

async function getTiers(): Promise<TierData[]> {
  try {
    const { db } = await import("@/lib/db");
    const tiers = await db.membershipTier.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      select: {
        id: true,
        tierName: true,
        hallBaseRate: true,
        hallHourlyRate: true,
        eventSupportBase: true,
        securityDeposit: true,
      },
    });
    return tiers.map((t) => ({
      id: t.id,
      tierName: t.tierName,
      hallBaseRate: String(t.hallBaseRate),
      hallHourlyRate: String(t.hallHourlyRate),
      eventSupportBase: String(t.eventSupportBase),
      securityDeposit: String(t.securityDeposit),
    }));
  } catch {
    return [];
  }
}

function formatCurrency(value: string): string {
  return `$${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

const highlights = [
  {
    title: "Flexible Seating",
    description:
      "Accommodate 50 to 450+ guests with banquet, theater, classroom, cocktail, and custom layouts.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    title: "Full AV Equipment",
    description:
      "Professional sound systems, wireless microphones, stage lighting, projectors, and more available on-site.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
    ),
  },
  {
    title: "Event Support Staff",
    description:
      "Dedicated event support teams for setup, coordination, and breakdown so you can focus on your guests.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Convenient Location",
    description:
      "Central Honolulu location with ample parking, easy freeway access, and close to major hotels.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  const tiers = await getTiers();

  // Show the top 3 tiers for the preview
  const previewTiers = tiers.filter((t) =>
    ["Member", "Non-Member", "Tenant Member"].includes(t.tierName)
  );

  return (
    <>
      {/* Hero with Parallax */}
      <ParallaxHero />

      {/* Stats Bar */}
      <div className="bg-slate-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            {[
              { value: '450+', label: 'Guest Capacity' },
              { value: '8', label: 'Event Packages' },
              { value: '40+', label: 'AV Equipment Items' },
              { value: 'Mon\u2013Sat', label: '8AM\u201310PM Available' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-amber-400">{stat.value}</p>
                <p className="text-xs text-stone-400 uppercase tracking-wide mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <section className="bg-stone-100 py-3">
        <div className="max-w-7xl mx-auto px-2 sm:px-3">
          {/* Mobile: 2-column grid */}
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            <div className="relative h-40 col-span-2">
              <Image
                src="https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80"
                alt="Elegant wedding reception table setup"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative h-28">
              <Image
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"
                alt="Beautiful event venue interior"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative h-28">
              <Image
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80"
                alt="Banquet dinner setup with warm lighting"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative h-28">
              <Image
                src="https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80"
                alt="Cocktail reception event"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative h-28">
              <Image
                src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80"
                alt="Corporate event and seminar setup"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
          {/* Desktop: 4-column grid with large left feature image */}
          <div className="hidden sm:grid sm:grid-cols-4 sm:gap-3 sm:h-80">
            <div className="relative col-span-2 row-span-2">
              <Image
                src="https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80"
                alt="Elegant wedding reception table setup"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"
                alt="Beautiful event venue interior"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80"
                alt="Banquet dinner setup with warm lighting"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80"
                alt="Cocktail reception event"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80"
                alt="Corporate event and seminar setup"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Package Suggester Section */}
      <section id="packages" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-700">
              Find Your Perfect Package
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Tell us about your event
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Enter your guest count and event type. We will recommend the right
              package instantly.
            </p>
          </div>
          <PackageSuggester />
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-stone-900">
            Honolulu&#39;s Premier Social Hall
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            Shoboji Social Hall offers an elegant, fully-equipped venue in the heart of Honolulu
            for celebrations of all kinds. With a spacious main hall accommodating up to 450+ guests,
            professional AV equipment on-site, dedicated event support staff, and in-house catering
            through Nu&#39;uanu Cookhouse, we handle every detail so you can focus on what matters most.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-navy-700">450+</p>
              <p className="mt-1 text-sm text-stone-500">Guest Capacity</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-navy-700">40+</p>
              <p className="mt-1 text-sm text-stone-500">AV Equipment Items</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-navy-700">6</p>
              <p className="mt-1 text-sm text-stone-500">Rental Tiers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-stone-900">
            Why Choose Shoboji
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-stone-200 bg-sand-50 p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-700/10 text-navy-700">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In-House Catering Section */}
      <section className="bg-stone-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="flex-1">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-700">
                In-House Catering Partner
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                Nu&#39;uanu Cookhouse
              </h2>
              <p className="mb-6 mt-4 text-lg text-slate-600">
                Authentic local Hawaiian cuisine available for your event through our in-house catering partner.
                From intimate gatherings to large celebrations, Nu&#39;uanu Cookhouse brings the flavors of Hawaii to your table.
              </p>
              <div className="mb-8 grid grid-cols-2 gap-3">
                {['Local Plate Lunch', 'Hawaiian', 'Japanese', 'Korean', 'American Comfort', 'Fusion'].map(cuisine => (
                  <div key={cuisine} className="flex items-center gap-2 text-slate-700">
                    <span className="text-amber-600">&#10003;</span>
                    <span>{cuisine}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-800">Buffet Style</span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-800">Bento Boxes</span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-800">Drop-Off Available</span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-800">Beverage Service</span>
              </div>
            </div>
            <div className="flex-1 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
              <h3 className="font-semibold text-slate-900">Book Hall + Catering Together</h3>
              <ul className="mb-6 mt-4 space-y-3 text-slate-600">
                <li className="flex items-start gap-2"><span className="font-bold text-green-600">&#10003;</span> One booking form for both hall and catering</li>
                <li className="flex items-start gap-2"><span className="font-bold text-green-600">&#10003;</span> Catering inquiry forwarded automatically</li>
                <li className="flex items-start gap-2"><span className="font-bold text-green-600">&#10003;</span> Separate catering quote from Nu&#39;uanu Cookhouse</li>
                <li className="flex items-start gap-2"><span className="font-bold text-green-600">&#10003;</span> Coordination handled by our team</li>
              </ul>
              <Link
                href="/book"
                className="block w-full rounded-lg bg-slate-900 py-3 text-center font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Book Hall + Catering
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      {previewTiers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-stone-900">
            Transparent Pricing
          </h2>
          <p className="mt-3 text-center text-stone-600">
            Base rate includes 4 hours of hall use. Additional hours billed
            at the hourly rate.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {previewTiers.map((tier) => (
              <div
                key={tier.id}
                className="flex flex-col rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-stone-900">
                  {tier.tierName}
                </h3>
                <p className="mt-4 text-4xl font-bold text-navy-700">
                  {formatCurrency(tier.hallBaseRate)}
                </p>
                <p className="text-sm text-stone-500">
                  base rate (4 hours)
                </p>
                <ul className="mt-6 space-y-3 text-sm text-stone-600">
                  <li className="flex justify-between">
                    <span>Additional hours</span>
                    <span className="font-medium text-stone-800">
                      {formatCurrency(tier.hallHourlyRate)}/hr
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Event support</span>
                    <span className="font-medium text-stone-800">
                      {formatCurrency(tier.eventSupportBase)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Security deposit</span>
                    <span className="font-medium text-stone-800">
                      {Number(tier.securityDeposit) > 0
                        ? formatCurrency(tier.securityDeposit)
                        : "Waived"}
                    </span>
                  </li>
                </ul>
                <div className="mt-auto pt-6">
                  <Link
                    href="/book"
                    className="block rounded-lg bg-navy-700 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                  >
                    Get a Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/rates"
              className="text-sm font-medium text-navy-700 underline-offset-4 hover:underline"
            >
              View all rates and membership tiers
            </Link>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-navy-700">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Ready to Book Your Event?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-200">
            Get an instant quote in minutes. Our booking wizard walks you through
            every detail so there are no surprises.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-navy-700 transition-colors hover:bg-stone-100"
            >
              Get an Instant Quote
            </Link>
            <Link
              href="/availability"
              className="rounded-lg border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Check Available Dates
            </Link>
          </div>
          <p className="mt-6 text-xs text-stone-400">
            Managed by Horiuchi Pacific Development Group · Catering by Nu&#39;uanu Cookhouse
          </p>
        </div>
      </section>
    </>
  );
}
