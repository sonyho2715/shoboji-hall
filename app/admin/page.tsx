import Link from 'next/link';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  Users,
  Plus,
  CalendarX,
  Eye,
} from 'lucide-react';

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCurrency(value: number | { toString(): string }): string {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  const [
    totalBookings,
    pendingInquiries,
    confirmedBookings,
    totalCustomers,
    recentBookings,
    upcomingEvents,
  ] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { status: 'inquiry' } }),
    db.booking.count({
      where: { status: { in: ['confirmed', 'deposit_paid'] } },
    }),
    db.customer.count(),
    db.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: true },
    }),
    db.booking.findMany({
      where: {
        eventDate: { gte: new Date() },
        status: { notIn: ['cancelled'] },
      },
      take: 5,
      orderBy: { eventDate: 'asc' },
      include: { customer: true },
    }),
  ]);

  return (
    <>
      <AdminHeader title="Dashboard" adminName={session.name} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={totalBookings}
            icon={Calendar}
          />
          <StatCard
            title="Pending Inquiries"
            value={pendingInquiries}
            icon={AlertCircle}
            alert={pendingInquiries > 0}
            subtitle={pendingInquiries > 0 ? 'Needs attention' : undefined}
          />
          <StatCard
            title="Confirmed Events"
            value={confirmedBookings}
            icon={CheckCircle}
          />
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            icon={Users}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Inquiries */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="font-semibold text-gray-900">
                Recent Inquiries
              </h2>
              <Link
                href="/admin/bookings?status=inquiry"
                className="text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentBookings.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-400">
                  No bookings yet
                </p>
              ) : (
                recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {booking.bookingNumber}
                        </span>
                        <StatusBadge status={booking.status} />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {booking.customer.fullName}
                        {' -- '}
                        {formatDate(booking.eventDate)}
                      </p>
                    </div>
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="ml-3 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="font-semibold text-gray-900">
                Upcoming Events
              </h2>
              <Link
                href="/admin/bookings?status=confirmed"
                className="text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {upcomingEvents.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-400">
                  No upcoming events
                </p>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(event.eventDate)}
                        </span>
                        <StatusBadge status={event.status} />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {event.customer.fullName}
                        {event.eventType ? ` -- ${event.eventType}` : ''}
                        {' -- '}
                        {event.adultCount + event.childCount} guests
                      </p>
                    </div>
                    <div className="ml-3 text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {formatCurrency(event.grandTotal)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h2 className="mb-3 font-semibold text-gray-900">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/bookings/new"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-900"
            >
              <Plus className="h-4 w-4" />
              New Inquiry
            </Link>
            <Link
              href="/admin/calendar"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <CalendarX className="h-4 w-4" />
              Block a Date
            </Link>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4" />
              View All Bookings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
