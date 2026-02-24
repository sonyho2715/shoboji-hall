import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { DownloadRateSheetButton } from "@/components/shared/DownloadRateSheetButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rates & Pricing | Shoboji Social Hall",
  description:
    "View membership tiers, hall rental rates, funeral package pricing, and equipment rates at Shoboji Social Hall.",
};

function formatCurrency(value: unknown): string {
  const num = Number(value);
  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export default async function RatesPage() {
  const [tiers, funeralTiers] = await Promise.all([
    db.membershipTier.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    }),
    db.funeralPackageTier.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          Rates & Pricing
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-stone-600">
          All hall rental base rates include 4 hours. Additional hours are billed
          at the hourly rate. Event support staff are included with every rental.
        </p>
      </div>

      {/* Membership Tiers Table */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-stone-900">
          Hall Rental Rates by Membership Tier
        </h2>
        <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">
                  Tier
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-stone-700">
                  4-Hr Base Rate
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-stone-700">
                  Hourly Rate
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-stone-700">
                  Event Support
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-stone-700">
                  Support Hourly
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-stone-700">
                  Security Deposit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {tiers.map((tier) => (
                <tr key={tier.id} className="hover:bg-stone-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="font-semibold text-stone-800">
                      {tier.tierName}
                    </p>
                    {tier.description && (
                      <p className="text-xs text-stone-500">
                        {tier.description}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-stone-800">
                    {formatCurrency(tier.hallBaseRate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-stone-600">
                    {formatCurrency(tier.hallHourlyRate)}/hr
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-stone-600">
                    {formatCurrency(tier.eventSupportBase)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-stone-600">
                    {formatCurrency(tier.eventSupportHourly)}/hr
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-stone-600">
                    {Number(tier.securityDeposit) > 0
                      ? formatCurrency(tier.securityDeposit)
                      : "Waived"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Funeral Package Rates */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-900">
          After-Funeral Reception Packages
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Flat-rate packages include hall rental, basic table and chair setup,
          kitchen access, and event support staff for a standard 4-hour
          reception.
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">
                  Tier
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">
                  Attendance
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-stone-700">
                  Package Rate
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-stone-700">
                  Security Deposit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {funeralTiers.map((ft) => (
                <tr key={ft.id} className="hover:bg-stone-50">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-800">
                    {ft.tierName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                    {ft.minAttendees}-{ft.maxAttendees} guests
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-stone-800">
                    {formatCurrency(ft.rate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-stone-600">
                    {Number(ft.securityDeposit) > 0
                      ? formatCurrency(ft.securityDeposit)
                      : "Waived"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Membership Info */}
      <section className="mt-16 rounded-xl border border-stone-200 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-stone-900">
          Annual Temple Membership
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-4xl font-bold text-navy-700">$150</p>
            <p className="text-sm text-stone-500">per year</p>
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              Temple members receive significantly reduced hall rental rates,
              lower or waived security deposits, and priority booking access.
              Membership supports the Shoboji Temple community and its ongoing
              programs.
            </p>
          </div>
          <div className="rounded-lg bg-stone-50 p-4">
            <h3 className="font-semibold text-stone-800">
              Member Benefits
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Lower base rental rate ($600 vs $800 for non-members)
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Reduced overtime hourly rate ($50/hr vs $100/hr)
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Lower security deposit ($100 vs $500)
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Discounted funeral reception packages
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Priority booking for popular dates
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* HPD Note */}
      <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h3 className="font-semibold text-amber-900">
          Events Serving Alcohol
        </h3>
        <p className="mt-2 text-sm text-amber-800">
          All events where alcohol is served require a Honolulu Police Department
          (HPD) security officer to be on-site for the duration of the event.
          The HPD detail is billed at $300 per hour and is automatically
          included in your event quote.
        </p>
      </section>

      {/* CTA */}
      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/book"
          className="inline-block rounded-lg bg-navy-700 px-8 py-3 font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Get Your Custom Quote
        </Link>
        <DownloadRateSheetButton />
      </div>
    </div>
  );
}
