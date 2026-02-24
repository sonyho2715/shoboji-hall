import { db } from '@/lib/db';
import { format, addDays } from 'date-fns';
import type { QuoteData } from './generate-quote';

/**
 * Fetches a booking from the database and transforms it into QuoteData
 * for PDF quote generation.
 */
export async function buildQuoteData(bookingId: number): Promise<QuoteData> {
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
    },
  });

  if (!booking) {
    throw new Error(`Booking with id ${bookingId} not found`);
  }

  // Calculate duration from start/end time
  const startTime = new Date(booking.eventStartTime);
  const endTime = new Date(booking.eventEndTime);
  const startMinutes = startTime.getUTCHours() * 60 + startTime.getUTCMinutes();
  const endMinutes = endTime.getUTCHours() * 60 + endTime.getUTCMinutes();
  const durationHours = (endMinutes - startMinutes) / 60;

  const totalAttendees = booking.adultCount + booking.childCount;
  const tierName = booking.membershipTier?.tierName || 'Non-Member';

  const now = new Date();
  const issueDate = format(now, 'MMMM d, yyyy');
  const validUntil = format(addDays(now, 30), 'MMMM d, yyyy');

  // Build line items
  const lineItems: QuoteData['lineItems'] = [];

  // Hall rental base (4-hr minimum)
  const hallBaseRate = booking.membershipTier
    ? Number(booking.membershipTier.hallBaseRate)
    : 0;
  const hallHourlyRate = booking.membershipTier
    ? Number(booking.membershipTier.hallHourlyRate)
    : 0;
  const overtimeHours = Math.max(0, durationHours - 4);

  if (!booking.isFuneralPackage) {
    lineItems.push({
      description: 'Hall Rental (4-hr minimum)',
      quantity: 1,
      unit: 'event',
      rate: hallBaseRate,
      total: hallBaseRate,
    });

    if (overtimeHours > 0) {
      lineItems.push({
        description: `Hall Overtime (${overtimeHours} hrs @ ${fmtRate(hallHourlyRate)}/hr)`,
        quantity: overtimeHours,
        unit: 'hour',
        rate: hallHourlyRate,
        total: overtimeHours * hallHourlyRate,
      });
    }
  }

  // Event support staff
  const supportBase = booking.membershipTier
    ? Number(booking.membershipTier.eventSupportBase)
    : 0;
  const supportHourly = booking.membershipTier
    ? Number(booking.membershipTier.eventSupportHourly)
    : 0;

  // Calculate required staff from attendees
  const requiredStaff = getRequiredStaff(totalAttendees);

  lineItems.push({
    description: `Event Support Staff (${requiredStaff} staff, 4-hr base)`,
    quantity: requiredStaff,
    unit: 'staff',
    rate: supportBase,
    total: supportBase,
  });

  if (overtimeHours > 0) {
    const supportOTTotal = overtimeHours * supportHourly * requiredStaff;
    lineItems.push({
      description: `Event Support Overtime (${requiredStaff} staff x ${overtimeHours} hrs @ ${fmtRate(supportHourly)}/hr)`,
      quantity: overtimeHours * requiredStaff,
      unit: 'hour',
      rate: supportHourly,
      total: supportOTTotal,
    });
  }

  // Equipment items
  for (const be of booking.bookingEquipment) {
    lineItems.push({
      description: `${be.equipment.name}${be.quantity > 1 ? ` (x${be.quantity})` : ''}`,
      quantity: be.quantity,
      unit: 'event',
      rate: Number(be.unitRate),
      total: Number(be.lineTotal),
    });
  }

  // Service items
  for (const bs of booking.bookingServices) {
    lineItems.push({
      description: bs.service.roleName,
      quantity: Number(bs.hours) || 1,
      unit: bs.service.rateType === 'hourly' ? 'hour' : 'event',
      rate: Number(bs.rateApplied),
      total: Number(bs.lineTotal),
    });
  }

  // HPD Security Officer (auto-included for alcohol events)
  if (booking.alcoholServed) {
    const hpdTotal = 300 * durationHours;
    lineItems.push({
      description: 'Security Officer (HPD) - Required for alcohol service',
      quantity: durationHours,
      unit: 'hour',
      rate: 300,
      total: hpdTotal,
    });
  }

  const subtotal = Number(booking.grandTotal) - Number(booking.securityDeposit);
  const securityDeposit = Number(booking.securityDeposit);
  const grandTotal = Number(booking.grandTotal);

  // Format event date and times for display
  const eventDate = format(new Date(booking.eventDate), 'MMMM d, yyyy');
  const startTimeStr = formatTimeDisplay(startTime);
  const endTimeStr = formatTimeDisplay(endTime);

  return {
    bookingNumber: booking.bookingNumber,
    issueDate,
    validUntil,
    customer: {
      fullName: booking.customer.fullName,
      organization: booking.customer.organization || undefined,
      email: booking.customer.email || undefined,
      phone: booking.customer.phone || undefined,
    },
    event: {
      eventType: booking.eventType || 'Event',
      eventDate,
      startTime: startTimeStr,
      endTime: endTimeStr,
      durationHours,
      totalAttendees,
      roomSetup: booking.roomSetup || undefined,
      bookingType: booking.bookingType,
    },
    lineItems,
    subtotal,
    securityDeposit,
    grandTotal,
    alcoholServed: booking.alcoholServed,
    membershipTierName: tierName,
  };
}

function getRequiredStaff(attendees: number): number {
  if (attendees <= 0) return 0;
  if (attendees <= 50) return 1;
  if (attendees <= 150) return 2;
  if (attendees <= 250) return 3;
  if (attendees <= 350) return 4;
  if (attendees <= 450) return 5;
  return 6;
}

function fmtRate(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function formatTimeDisplay(time: Date): string {
  const hours = time.getUTCHours();
  const minutes = time.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const min = minutes.toString().padStart(2, '0');
  return `${h12}:${min} ${ampm}`;
}
