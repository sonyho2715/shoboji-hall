import Link from 'next/link';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Plus, Search, Eye } from 'lucide-react';
import { Prisma } from '@/app/generated/prisma/client';

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'inquiry', label: 'Inquiry' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'deposit_paid', label: 'Deposit Paid' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PER_PAGE = 20;

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

interface PageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function BookingsListPage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  const params = await searchParams;

  const statusFilter = params.status || '';
  const searchQuery = params.search || '';
  const page = parseInt(params.page || '1', 10);
  const skip = (page - 1) * PER_PAGE;

  // Build Prisma where clause
  const where: Prisma.BookingWhereInput = {};

  if (statusFilter) {
    where.status = statusFilter;
  }

  if (searchQuery) {
    where.OR = [
      { bookingNumber: { contains: searchQuery, mode: 'insensitive' } },
      {
        customer: {
          fullName: { contains: searchQuery, mode: 'insensitive' },
        },
      },
    ];
  }

  const [bookings, total] = await Promise.all([
    db.booking.findMany({
      where,
      include: { customer: true, membershipTier: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: PER_PAGE,
    }),
    db.booking.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <>
      <AdminHeader title="Bookings" adminName={session.name}>
        <Link
          href="/admin/bookings/new"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
        >
          <Plus className="h-4 w-4" />
          New Booking
        </Link>
      </AdminHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <form method="GET" className="flex flex-wrap items-center gap-3">
            {/* Preserve other params */}
            {statusFilter && (
              <input type="hidden" name="status" value={statusFilter} />
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search by name or booking #"
                className="rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
              />
            </div>
          </form>

          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <Link
                key={s.value}
                href={`/admin/bookings?status=${s.value}${
                  searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''
                }`}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === s.value
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Booking #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Event Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Guests
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-12 text-center text-sm text-gray-400"
                    >
                      {searchQuery || statusFilter
                        ? 'No bookings match your filters'
                        : 'No bookings yet'}
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking, i) => (
                    <tr
                      key={booking.id}
                      className={`${
                        i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      } hover:bg-blue-50/30 transition-colors`}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                        {booking.bookingNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div>{booking.customer.fullName}</div>
                        {booking.customer.organization && (
                          <div className="text-xs text-gray-400">
                            {booking.customer.organization}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {formatDate(booking.eventDate)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {booking.eventType || booking.bookingType.replace(/_/g, ' ')}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {booking.adultCount + booking.childCount}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700">
                        {formatCurrency(booking.grandTotal)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
              <p className="text-sm text-gray-500">
                Showing {skip + 1}--{Math.min(skip + PER_PAGE, total)} of{' '}
                {total} bookings
              </p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={`/admin/bookings?status=${statusFilter}&search=${encodeURIComponent(
                        searchQuery
                      )}&page=${p}`}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                        p === page
                          ? 'bg-slate-800 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
