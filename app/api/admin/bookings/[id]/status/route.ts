import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { logBookingAction } from '@/lib/booking-history';

const VALID_STATUSES = [
  'inquiry',
  'quoted',
  'confirmed',
  'deposit_paid',
  'completed',
  'cancelled',
] as const;

const statusUpdateSchema = z.object({
  status: z.enum(VALID_STATUSES),
  note: z.string().optional(),
});

/**
 * PATCH /api/admin/bookings/[id]/status
 * Update booking status and log to history.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();

    const { id } = await params;
    const bookingId = parseInt(id, 10);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, note } = statusUpdateSchema.parse(body);

    // Get current booking
    const current = await db.booking.findUnique({
      where: { id: bookingId },
      select: { status: true, bookingNumber: true },
    });

    if (!current) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Build update data based on new status
    const updateData: Record<string, unknown> = { status };

    if (status === 'quoted') {
      updateData.quoteSentDate = new Date();
    } else if (status === 'deposit_paid') {
      updateData.depositReceivedDate = new Date();
    }

    // Update booking status
    const booking = await db.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    // Log status change in history
    await logBookingAction(
      bookingId,
      'status_changed',
      { from: current.status, to: status, note: note || null },
      session.email
    );

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Status update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
