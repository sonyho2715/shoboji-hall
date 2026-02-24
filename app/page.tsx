import Link from "next/link";

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
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-700">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 via-navy-700 to-forest-700/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Shoboji Social Hall
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-stone-200 sm:text-xl">
              A gracious gathering place in the heart of Honolulu, where
              tradition meets celebration. Host your wedding, reception,
              memorial, or community event in our spacious, fully-equipped hall.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/availability"
                className="rounded-lg border-2 border-white/30 px-6 py-3 text-center font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Check Availability
              </Link>
              <Link
                href="/book"
                className="rounded-lg bg-white px-6 py-3 text-center font-semibold text-navy-700 transition-colors hover:bg-stone-100"
              >
                Book Your Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-stone-900">
            Your Event, Our Legacy
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            Nestled within the grounds of Shoboji Temple on South Beretania
            Street, our social hall has been the home of countless celebrations,
            gatherings, and milestones for Honolulu families. With a spacious
            main hall accommodating up to 450+ guests, a fully equipped
            commercial kitchen, and dedicated staff, we provide everything you
            need for an event that truly honors the occasion.
          </p>
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
        </div>
      </section>
    </>
  );
}
