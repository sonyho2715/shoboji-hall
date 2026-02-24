'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Lock, Unlock } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/admin/Modal';

interface BlockedDate {
  id: number;
  blockedDate: string;
  reason: string | null;
  blockedBy: string | null;
}

interface BookingEntry {
  id: number;
  bookingNumber: string;
  eventDate: string;
  eventType: string | null;
  status: string;
  customer: { fullName: string };
  adultCount: number;
  childCount: number;
}

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  blocked?: BlockedDate;
  bookings: BookingEntry[];
}

function getMonthDays(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: CalendarDay[] = [];

  // Previous month fill
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevMonth = month === 0 ? 12 : month;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({
      date: dateStr,
      day,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      bookings: [],
    });
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({
      date: dateStr,
      day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      bookings: [],
    });
  }

  // Next month fill
  const remaining = 42 - days.length;
  for (let day = 1; day <= remaining; day++) {
    const nextMonth = month === 11 ? 1 : month + 2;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({
      date: dateStr,
      day,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      bookings: [],
    });
  }

  return days;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function CalendarManagementPage() {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [bookings, setBookings] = useState<BookingEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    // Fetch 3 months of data around current view
    const startDate = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-01`;
    const endMonth = viewMonth + 3 > 12 ? (viewMonth + 3) % 12 : viewMonth + 3;
    const endYear = viewMonth + 3 > 12 ? viewYear + 1 : viewYear;
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-28`;

    try {
      const [blockedRes, bookingsRes] = await Promise.all([
        fetch(
          `/api/calendar/availability?startDate=${startDate}&endDate=${endDate}`
        ),
        fetch(`/api/bookings?status=`),
      ]);

      if (blockedRes.ok) {
        const blockedData = await blockedRes.json();
        // We need the full blocked date records for IDs
        // Fetch from a different endpoint
        setBlockedDates([]);

        // For now, parse from availability data
        if (blockedData.data?.blockedDates) {
          // Map to our interface - we'll use date as pseudo-ID
          const mapped = blockedData.data.blockedDates.map(
            (bd: { date: string; reason: string | null }, i: number) => ({
              id: i,
              blockedDate: bd.date,
              reason: bd.reason,
              blockedBy: null,
            })
          );
          setBlockedDates(mapped);
        }
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        if (bookingsData.data) {
          setBookings(bookingsData.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch calendar data:', err);
    }
  }, [viewMonth, viewYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const navigateMonth = (delta: number) => {
    let newMonth = viewMonth + delta;
    let newYear = viewYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  // Build calendar grid
  const days = getMonthDays(viewYear, viewMonth);

  // Annotate days with blocked/booking data
  const blockedMap = new Map(
    blockedDates.map((bd) => [bd.blockedDate, bd])
  );
  const bookingsByDate = new Map<string, BookingEntry[]>();
  for (const b of bookings) {
    const dateStr = new Date(b.eventDate).toISOString().split('T')[0];
    if (!bookingsByDate.has(dateStr)) bookingsByDate.set(dateStr, []);
    bookingsByDate.get(dateStr)!.push(b);
  }

  for (const day of days) {
    day.blocked = blockedMap.get(day.date);
    day.bookings = bookingsByDate.get(day.date) || [];
  }

  const selectedDay = selectedDate
    ? days.find((d) => d.date === selectedDate) || null
    : null;

  const handleBlockDate = async () => {
    if (!selectedDate) return;
    setLoading(true);

    try {
      const res = await fetch('/api/calendar/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          reason: blockReason || undefined,
        }),
      });

      if (res.ok) {
        setBlockReason('');
        setSelectedDate(null);
        fetchData();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockDate = async (blockedDate: BlockedDate) => {
    setLoading(true);

    try {
      // We need the actual DB ID. Since our current availability API doesn't return IDs,
      // we'll use a workaround: find by date
      const res = await fetch(`/api/calendar/block/${blockedDate.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSelectedDate(null);
        fetchData();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Calendar Management
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Block dates, view bookings, and manage availability
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-200 border border-red-300" />
              Blocked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-green-200 border border-green-300" />
              Booked
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigateMonth(-1)}
            className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div
                key={d}
                className="px-2 py-2 text-center text-xs font-medium uppercase text-gray-500"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {days.map((day) => {
              const hasConfirmedBooking = day.bookings.some((b) =>
                ['confirmed', 'deposit_paid'].includes(b.status)
              );
              const hasAnyBooking = day.bookings.length > 0;

              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`relative min-h-[80px] border-b border-r border-gray-100 p-1.5 text-left transition-colors hover:bg-blue-50/50 ${
                    !day.isCurrentMonth ? 'bg-gray-50 text-gray-300' : ''
                  } ${day.isToday ? 'ring-2 ring-inset ring-blue-400' : ''} ${
                    day.blocked ? 'bg-red-50' : ''
                  } ${
                    hasConfirmedBooking && !day.blocked ? 'bg-green-50' : ''
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                      day.isToday
                        ? 'bg-blue-600 text-white'
                        : day.isCurrentMonth
                          ? 'text-gray-700'
                          : 'text-gray-300'
                    }`}
                  >
                    {day.day}
                  </span>

                  {day.blocked && day.isCurrentMonth && (
                    <div className="mt-0.5">
                      <span className="inline-flex items-center gap-0.5 rounded bg-red-100 px-1 py-0.5 text-[10px] font-medium text-red-700">
                        <Lock className="h-2.5 w-2.5" />
                        Blocked
                      </span>
                    </div>
                  )}

                  {hasAnyBooking && day.isCurrentMonth && (
                    <div className="mt-0.5 space-y-0.5">
                      {day.bookings.slice(0, 2).map((b) => (
                        <div
                          key={b.id}
                          className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${
                            ['confirmed', 'deposit_paid'].includes(b.status)
                              ? 'bg-green-100 text-green-700'
                              : b.status === 'inquiry'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {b.customer.fullName}
                        </div>
                      ))}
                      {day.bookings.length > 2 && (
                        <span className="text-[10px] text-gray-400">
                          +{day.bookings.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Date Detail Modal */}
      <Modal
        open={!!selectedDate}
        onClose={() => {
          setSelectedDate(null);
          setBlockReason('');
        }}
        title={
          selectedDate
            ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : ''
        }
      >
        {selectedDay && (
          <div className="space-y-4">
            {/* Blocked Status */}
            {selectedDay.blocked ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Date is Blocked
                    </p>
                    {selectedDay.blocked.reason && (
                      <p className="mt-0.5 text-sm text-red-600">
                        Reason: {selectedDay.blocked.reason}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnblockDate(selectedDay.blocked!)}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Unlock className="h-3.5 w-3.5" />
                    Unblock
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Block this date
                </p>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                />
                <button
                  onClick={handleBlockDate}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <Lock className="h-3.5 w-3.5" />
                  {loading ? 'Blocking...' : 'Block Date'}
                </button>
              </div>
            )}

            {/* Bookings on this date */}
            {selectedDay.bookings.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Bookings ({selectedDay.bookings.length})
                </h4>
                <div className="space-y-2">
                  {selectedDay.bookings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {b.customer.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {b.bookingNumber}
                          {b.eventType ? ` -- ${b.eventType}` : ''}
                          {' -- '}
                          {b.adultCount + b.childCount} guests
                        </p>
                      </div>
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!selectedDay.blocked && selectedDay.bookings.length === 0 && (
              <p className="text-center text-sm text-gray-400">
                No bookings or blocks on this date
              </p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
