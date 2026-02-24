"use client";

import { useState } from "react";
import Link from "next/link";
import { suggestPackages, EVENT_TYPE_OPTIONS } from "@/lib/packages";
import { PackageCard } from "./PackageCard";

interface PackageSuggesterProps {
  initialGuests?: number;
  initialEventType?: string;
}

export function PackageSuggester({
  initialGuests,
  initialEventType,
}: PackageSuggesterProps) {
  const [guestCount, setGuestCount] = useState(initialGuests || 100);
  const [eventType, setEventType] = useState(initialEventType || "");

  const suggestions = eventType
    ? suggestPackages(guestCount, eventType)
    : [];

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="mx-auto max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Guest Count */}
          <div>
            <label
              htmlFor="pkg-guests"
              className="block text-sm font-medium text-stone-700"
            >
              Expected Guests
            </label>
            <div className="mt-1 flex items-center gap-3">
              <input
                id="pkg-guests"
                type="range"
                min={10}
                max={450}
                step={5}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-navy-700"
              />
              <span className="min-w-[3.5rem] rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-center text-sm font-semibold text-stone-800">
                {guestCount}
              </span>
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label
              htmlFor="pkg-event-type"
              className="block text-sm font-medium text-stone-700"
            >
              Event Type
            </label>
            <select
              id="pkg-event-type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
            >
              <option value="">Select your event type</option>
              {EVENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Prompt when no event type selected */}
      {!eventType && (
        <div className="py-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <svg
              className="h-6 w-6 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <p className="text-stone-500">
            Select your event type above to see personalized package
            recommendations.
          </p>
        </div>
      )}

      {/* Suggestions */}
      {eventType && suggestions.length > 0 && (
        <div>
          <p className="mb-4 text-center text-sm font-medium text-stone-500">
            {suggestions.length === 1
              ? "We recommend this package for your event"
              : `We found ${suggestions.length} packages that match your event`}
          </p>
          <div
            className={`grid gap-6 ${
              suggestions.length === 1
                ? "max-w-md mx-auto"
                : suggestions.length === 2
                  ? "sm:grid-cols-2 max-w-3xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {suggestions.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                guestCount={guestCount}
              />
            ))}
          </div>
        </div>
      )}

      {/* No matches */}
      {eventType && suggestions.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-stone-500">
            No pre-configured packages match your criteria, but you can still
            build a custom booking.
          </p>
        </div>
      )}

      {/* Custom booking link */}
      <div className="text-center">
        <Link
          href="/book"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 underline-offset-4 hover:underline"
        >
          Or build a custom package
          <svg
            className="h-3.5 w-3.5"
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
