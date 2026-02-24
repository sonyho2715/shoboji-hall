"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface MonthData {
  year: number;
  month: number; // 0-indexed
}

function getMonths(count: number): MonthData[] {
  const now = new Date();
  const months: MonthData[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return months;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AvailabilityPage() {
  const [months] = useState(() => getMonths(4));
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const first = months[0];
      const last = months[months.length - 1];
      const startDate = formatDateKey(first.year, first.month, 1);
      const endDay = getDaysInMonth(last.year, last.month);
      const endDate = formatDateKey(last.year, last.month, endDay);

      const res = await fetch(
        `/api/calendar/availability?startDate=${startDate}&endDate=${endDate}`
      );
      const json = await res.json();

      if (json.success) {
        setUnavailableDates(new Set(json.data.unavailableDates));
      }
    } catch {
      // Silently fail, show all dates as available
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const today = new Date();
  const todayKey = formatDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          Check Availability
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-stone-600">
          View available dates for the next 4 months. Select an available date
          to start your booking.
        </p>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded border border-stone-200 bg-white" />
          <span className="text-stone-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-red-100 ring-1 ring-red-200" />
          <span className="text-stone-600">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-navy-700" />
          <span className="text-stone-600">Today</span>
        </div>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-navy-700" />
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {months.map(({ year, month }) => {
            const daysInMonth = getDaysInMonth(year, month);
            const firstDay = getFirstDayOfWeek(year, month);

            return (
              <div
                key={`${year}-${month}`}
                className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6"
              >
                <h2 className="text-center text-lg font-bold text-stone-800">
                  {MONTH_NAMES[month]} {year}
                </h2>

                {/* Day headers */}
                <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-stone-500">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days */}
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {/* Empty cells for first week */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateKey = formatDateKey(year, month, day);
                    const isUnavailable = unavailableDates.has(dateKey);
                    const isPast = dateKey < todayKey;
                    const isToday = dateKey === todayKey;
                    const isSelectable = !isUnavailable && !isPast;

                    if (isPast) {
                      return (
                        <div
                          key={day}
                          className="flex h-10 items-center justify-center rounded-lg text-sm text-stone-300"
                        >
                          {day}
                        </div>
                      );
                    }

                    if (isUnavailable) {
                      return (
                        <div
                          key={day}
                          className="flex h-10 items-center justify-center rounded-lg bg-red-50 text-sm text-red-400 line-through"
                        >
                          {day}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={day}
                        href={`/book?date=${dateKey}`}
                        className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          isToday
                            ? "bg-navy-700 text-white hover:bg-navy-800"
                            : isSelectable
                              ? "bg-forest-500/5 text-forest-700 hover:bg-forest-500/15"
                              : ""
                        }`}
                      >
                        {day}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-sm text-stone-500">
          Dates shown as available are subject to confirmation. For same-day or
          next-day bookings, please call us directly.
        </p>
        <Link
          href="/book"
          className="mt-4 inline-block rounded-lg bg-navy-700 px-8 py-3 font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Start Your Booking
        </Link>
      </div>
    </div>
  );
}
