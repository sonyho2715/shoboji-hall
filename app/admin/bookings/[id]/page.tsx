import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { BookingDetailActions } from '@/components/admin/BookingDetailActions';
import { BookingNotesEditor } from '@/components/admin/BookingNotesEditor';
import { FollowUpEditor } from '@/components/admin/FollowUpEditor';
import { BookingDocuments } from '@/components/admin/BookingDocuments';
import { AuditLog } from '@/components/admin/AuditLog';
import { ArrowLeft, User, MapPin, Phone, Mail } from 'lucide-react';

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(time: Date | string): string {
  const d = new Date(time);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatCurrency(value: number | { toString(): string }): string {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
  const session = await requireAdmin();
  const { id } = await params;
  const bookingId = parseInt(id, 10);

  if (isNaN(bookingId)) {
    notFound();
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: {
        include: { membershipTier: true },
      },
      membershipTier: true,
      bookingEquipment: {
        include: { equipment: { include: { category: true } } },
      },
      bookingServices: {
        include: { service: true },
      },
      bookingHistory: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const totalAttendees = booking.adultCount + booking.childCount;
  const followUpDateStr = booking.followUpDate
    ? new Date(booking.followUpDate).toISOString().split('T')[0]
    : null;

  return (
    <>
      <AdminHeader title={`Booking ${booking.bookingNumber}`} adminName={session.name}>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </Link>
      </AdminHeader>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (main) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Booking Header */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-900">
                      {booking.bookingNumber}
                    </h2>
                    <StatusBadge status={booking.status} size="md" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Event Date: {formatDate(booking.eventDate)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <BookingDetailActions
                  bookingId={booking.id}
                  currentStatus={booking.status}
                />
              </div>
            </div>

            {/* Event Details */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">
                Event Details
              </h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-400">
                    Event Type
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {booking.eventType || 'Not specified'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-400">
                    Booking Type
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {booking.bookingType.replace(/_/g, ' ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-400">
                    Time
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {formatTime(booking.eventStartTime)} --{' '}
                    {formatTime(booking.eventEndTime)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-400">
                    Attendees
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {totalAttendees} total ({booking.adultCount} adults,{' '}
                    {booking.childCount} children)
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-400">
                    Room Setup
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {booking.roomSetup || 'Not specified'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-400">
                    Alcohol
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {booking.alcoholServed
                      ? `Yes (${booking.barType || 'type not specified'})`
                      : 'No'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-400">
                    Setup Hours
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {Number(booking.setupHours)}h setup,{' '}
                    {Number(booking.breakdownHours)}h breakdown
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-400">
                    Vehicles Expected
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {booking.expectedVehicles}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-400">
                    Membership Tier
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {booking.membershipTier?.tierName || 'Not assigned'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-400">
                    Referral Source
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {booking.referralSource?.replace(/_/g, ' ') || 'Not specified'}
                  </dd>
                </div>
              </dl>
              {booking.eventDescription && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <dt className="text-xs font-medium uppercase text-gray-400">
                    Description
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-700">
                    {booking.eventDescription}
                  </dd>
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Customer Information
                </h3>
                <Link
                  href={`/admin/customers/${booking.customer.id}`}
                  className="text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  View Profile
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="h-4 w-4 text-gray-400" />
                  {booking.customer.fullName}
                </div>
                {booking.customer.organization && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {booking.customer.organization}
                  </div>
                )}
                {booking.customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {booking.customer.phone}
                  </div>
                )}
                {booking.customer.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {booking.customer.email}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  Tier: {booking.customer.membershipTier?.tierName || 'N/A'}
                  {booking.customer.isMember && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Member
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Equipment Breakdown */}
            {booking.bookingEquipment.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 font-semibold text-gray-900">
                  Equipment
                </h3>
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr>
                      <th className="pb-2 text-left text-xs font-medium uppercase text-gray-400">
                        Item
                      </th>
                      <th className="pb-2 text-left text-xs font-medium uppercase text-gray-400">
                        Category
                      </th>
                      <th className="pb-2 text-right text-xs font-medium uppercase text-gray-400">
                        Qty
                      </th>
                      <th className="pb-2 text-right text-xs font-medium uppercase text-gray-400">
                        Rate
                      </th>
                      <th className="pb-2 text-right text-xs font-medium uppercase text-gray-400">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {booking.bookingEquipment.map((be) => (
                      <tr key={be.id}>
                        <td className="py-2 text-sm text-gray-700">
                          {be.equipment.name}
                        </td>
                        <td className="py-2 text-sm text-gray-500">
                          {be.equipment.category.name}
                        </td>
                        <td className="py-2 text-right text-sm text-gray-700">
                          {be.quantity}
                        </td>
                        <td className="py-2 text-right text-sm text-gray-700">
                          {formatCurrency(be.unitRate)}
                        </td>
                        <td className="py-2 text-right text-sm font-medium text-gray-700">
                          {formatCurrency(be.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Services Breakdown */}
            {booking.bookingServices.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 font-semibold text-gray-900">
                  Services
                </h3>
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr>
                      <th className="pb-2 text-left text-xs font-medium uppercase text-gray-400">
                        Service
                      </th>
                      <th className="pb-2 text-right text-xs font-medium uppercase text-gray-400">
                        Hours
                      </th>
                      <th className="pb-2 text-right text-xs font-medium uppercase text-gray-400">
                        Rate
                      </th>
                      <th className="pb-2 text-right text-xs font-medium uppercase text-gray-400">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {booking.bookingServices.map((bs) => (
                      <tr key={bs.id}>
                        <td className="py-2 text-sm text-gray-700">
                          {bs.service.roleName}
                        </td>
                        <td className="py-2 text-right text-sm text-gray-700">
                          {Number(bs.hours) || '--'}
                        </td>
                        <td className="py-2 text-right text-sm text-gray-700">
                          {formatCurrency(bs.rateApplied)}
                          {bs.service.rateType === 'hourly' ? '/hr' : ''}
                        </td>
                        <td className="py-2 text-right text-sm font-medium text-gray-700">
                          {formatCurrency(bs.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">
                Pricing Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Hall Rental</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(booking.hallRentalTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Event Support</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(booking.eventSupportTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Equipment</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(booking.equipmentTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Services</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(booking.servicesTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Security Deposit</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(booking.securityDeposit)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-gray-900">
                      Grand Total
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      {formatCurrency(booking.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (sidebar) */}
          <div className="space-y-6">
            {/* Internal Notes */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">
                Internal Notes
              </h3>
              <BookingNotesEditor
                bookingId={booking.id}
                initialNotes={booking.additionalNotes || ''}
              />
            </div>

            {/* Follow-up & Staff */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">
                Follow-up & Assignment
              </h3>
              <FollowUpEditor
                bookingId={booking.id}
                initialDate={followUpDateStr}
                initialStaff={booking.assignedStaff}
              />
            </div>

            {/* Documents & Communication */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">Documents</h3>
              <BookingDocuments
                bookingId={booking.id}
                bookingNumber={booking.bookingNumber}
                customerEmail={booking.customer.email}
                currentStatus={booking.status}
                quoteSentDate={
                  booking.quoteSentDate
                    ? new Date(booking.quoteSentDate).toISOString()
                    : null
                }
              />
            </div>

            {/* Key Dates */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">Key Dates</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Inquiry Date</dt>
                  <dd className="text-gray-700">
                    {new Date(booking.inquiryDate).toLocaleDateString()}
                  </dd>
                </div>
                {booking.quoteSentDate && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Quote Sent</dt>
                    <dd className="text-gray-700">
                      {new Date(booking.quoteSentDate).toLocaleDateString()}
                    </dd>
                  </div>
                )}
                {booking.depositReceivedDate && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Deposit Received</dt>
                    <dd className="text-gray-700">
                      {new Date(
                        booking.depositReceivedDate
                      ).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Audit History */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">
                Activity History
              </h3>
              <AuditLog entries={booking.bookingHistory} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
