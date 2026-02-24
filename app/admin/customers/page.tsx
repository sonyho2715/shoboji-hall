import Link from 'next/link';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Search, Eye } from 'lucide-react';
import { Prisma } from '@/app/generated/prisma/client';

const PER_PAGE = 20;

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  const params = await searchParams;

  const searchQuery = params.search || '';
  const page = parseInt(params.page || '1', 10);
  const skip = (page - 1) * PER_PAGE;

  const where: Prisma.CustomerWhereInput = searchQuery
    ? {
        OR: [
          { fullName: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } },
          { organization: { contains: searchQuery, mode: 'insensitive' } },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    db.customer.findMany({
      where,
      include: {
        membershipTier: true,
        _count: { select: { bookings: true } },
        bookings: {
          orderBy: { eventDate: 'desc' },
          take: 1,
          select: { eventDate: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: PER_PAGE,
    }),
    db.customer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <>
      <AdminHeader title="Customers" adminName={session.name} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Search */}
        <div className="mb-4">
          <form method="GET">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search by name, email, or organization"
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Customers Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Organization
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Member
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Bookings
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Booking
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-12 text-center text-sm text-gray-400"
                    >
                      {searchQuery
                        ? 'No customers match your search'
                        : 'No customers yet'}
                    </td>
                  </tr>
                ) : (
                  customers.map((customer, i) => (
                    <tr
                      key={customer.id}
                      className={`${
                        i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      } hover:bg-blue-50/30 transition-colors`}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                        {customer.fullName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {customer.organization || '--'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {customer.email || '--'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {customer.phone || '--'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {customer.membershipTier?.tierName || '--'}
                      </td>
                      <td className="px-4 py-3">
                        {customer.isMember ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {customer._count.bookings}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                        {customer.bookings[0]
                          ? formatDate(customer.bookings[0].eventDate)
                          : '--'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <Link
                          href={`/admin/customers/${customer.id}`}
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
                {total} customers
              </p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={`/admin/customers?search=${encodeURIComponent(
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
