"use client";

import Link from "next/link";
import type { EventPackage } from "@/lib/packages";
import { estimatePackagePrice } from "@/lib/pricing-engine";

interface PackageCardProps {
  pkg: EventPackage;
  guestCount?: number;
  compact?: boolean;
}

function formatPrice(n: number): string {
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  amber: {
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-800",
  },
  pink: {
    border: "border-l-pink-500",
    bg: "bg-pink-50",
    text: "text-pink-700",
    badge: "bg-pink-100 text-pink-800",
  },
  rose: {
    border: "border-l-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-800",
  },
  blue: {
    border: "border-l-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-800",
  },
  green: {
    border: "border-l-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    badge: "bg-green-100 text-green-800",
  },
  slate: {
    border: "border-l-slate-400",
    bg: "bg-slate-50",
    text: "text-slate-600",
    badge: "bg-slate-100 text-slate-700",
  },
  purple: {
    border: "border-l-purple-500",
    bg: "bg-purple-50",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-800",
  },
  teal: {
    border: "border-l-teal-500",
    bg: "bg-teal-50",
    text: "text-teal-700",
    badge: "bg-teal-100 text-teal-800",
  },
};

export function PackageCard({ pkg, guestCount, compact }: PackageCardProps) {
  const colors = colorMap[pkg.color] || colorMap.slate;
  const midGuests = guestCount || Math.round((pkg.minGuests + pkg.maxGuests) / 2);
  const estimate = estimatePackagePrice(pkg.durationHours, midGuests);
  const isFuneral = pkg.id === "funeral-reception-small";
  const bookUrl = `/book?package=${pkg.id}&guests=${midGuests}`;

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md ${colors.border} border-l-4`}
    >
      {/* Header */}
      <div className={`px-5 pt-5 pb-3 ${isFuneral ? "" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label={pkg.name}>
              {pkg.icon}
            </span>
            <div>
              <h3 className="text-lg font-bold text-stone-900">{pkg.name}</h3>
              <p className="text-sm text-stone-500">{pkg.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="flex-1 px-5 pb-4">
        <ul className="space-y-1.5">
          {pkg.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-stone-600">
              <svg
                className={`mt-0.5 h-4 w-4 shrink-0 ${colors.text}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              {h}
            </li>
          ))}
        </ul>

        {/* Equipment count badge */}
        {!compact && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}>
              {pkg.includedEquipment.length} equipment items
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}>
              {pkg.durationHours}h duration
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}>
              {pkg.roomSetup} layout
            </span>
          </div>
        )}
      </div>

      {/* Price Estimate */}
      <div className="border-t border-stone-100 bg-stone-50/50 px-5 py-3">
        {isFuneral ? (
          <p className="text-sm text-stone-600">
            Flat-rate pricing based on membership tier
          </p>
        ) : (
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="text-sm text-stone-700">
              <span className="font-semibold text-navy-700">
                Members from {formatPrice(estimate.memberEstimate)}
              </span>
            </p>
            <p className="text-xs text-stone-500">
              Non-members from {formatPrice(estimate.nonMemberEstimate)}
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 pt-3">
        <Link
          href={bookUrl}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Select This Package
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
