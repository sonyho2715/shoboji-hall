import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { logBookingAction } from '@/lib/booking-history';

const notesSchema = z.object({
  notes: z.string(),
});

/**
 * PATCH /api/admin/bookings/[id]/notes
 * Update internal notes on a booking.
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
    const { notes } = notesSchema.parse(body);

    const booking = await db.booking.update({
      where: { id: bookingId },
      data: { additionalNotes: notes },
    });

    await logBookingAction(
      bookingId,
      'notes_updated',
      { updatedBy: session.email },
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

    console.error('Notes update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notes' },
      { status: 500 }
    );
  }
}
