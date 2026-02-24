import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ArrowLeft, Eye, User, Mail, Phone, Building2 } from 'lucide-react';
import { CustomerNotesEditor } from './CustomerNotesEditor';

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
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const session = await requireAdmin();
  const { id } = await params;
  const customerId = parseInt(id, 10);

  if (isNaN(customerId)) notFound();

  const customer = await db.customer.findUnique({
    where: { id: customerId },
    include: {
      membershipTier: true,
      bookings: {
        orderBy: { eventDate: 'desc' },
        include: { membershipTier: true },
      },
    },
  });

  if (!customer) notFound();

  return (
    <>
      <AdminHeader title={customer.fullName} adminName={session.name}>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Link>
      </AdminHeader>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Customer Info Card */}
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-900">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {customer.fullName}
                  </span>
                </div>
                {customer.organization && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {customer.organization}
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {customer.email}
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {customer.phone}
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Membership Tier</span>
                  <span className="font-medium text-gray-700">
                    {customer.membershipTier?.tierName || 'None'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Member</span>
                  <span>
                    {customer.isMember ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Preferred Contact</span>
                  <span className="capitalize text-gray-700">
                    {customer.preferredContact}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Bookings</span>
                  <span className="font-medium text-gray-700">
                    {customer.bookings.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Customer Since</span>
                  <span className="text-gray-700">
                    {formatDate(customer.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">Notes</h3>
              <CustomerNotesEditor
                customerId={customer.id}
                initialNotes={customer.notes || ''}
              />
            </div>
          </div>

          {/* Booking History */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                  Booking History ({customer.bookings.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Booking #
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
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customer.bookings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-sm text-gray-400"
                        >
                          No bookings yet
                        </td>
                      </tr>
                    ) : (
                      customer.bookings.map((booking, i) => (
                        <tr
                          key={booking.id}
                          className={`${
                            i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          } hover:bg-blue-50/30 transition-colors`}
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                            {booking.bookingNumber}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                            {formatDate(booking.eventDate)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                            {booking.eventType ||
                              booking.bookingType.replace(/_/g, ' ')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {booking.adultCount + booking.childCount}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700">
                            {formatCurrency(booking.grandTotal)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <StatusBadge status={booking.status} />
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
