import { db } from '@/lib/db';

/**
 * Generate the next sequential booking number for the current year.
 * Format: SH-YYYY-NNNN (e.g., SH-2026-0001)
 */
export async function generateBookingNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `SH-${currentYear}-`;

  // Find the latest booking number for this year
  const latestBooking = await db.booking.findFirst({
    where: {
      bookingNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      bookingNumber: 'desc',
    },
    select: {
      bookingNumber: true,
    },
  });

  let nextNumber = 1;

  if (latestBooking) {
    // Extract the numeric part from SH-YYYY-NNNN
    const parts = latestBooking.bookingNumber.split('-');
    const lastNumber = parseInt(parts[2], 10);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  // Pad to 4 digits
  const paddedNumber = String(nextNumber).padStart(4, '0');
  return `${prefix}${paddedNumber}`;
}
