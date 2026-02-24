import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/admin/bookings/[id]
 * Full booking detail with customer, equipment, services, and history.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const bookingId = parseInt(id, 10);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Booking detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/bookings/[id]
 * Update booking fields.
 */
export async function PUT(
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

    const booking = await db.booking.update({
      where: { id: bookingId },
      data: {
        assignedStaff: body.assignedStaff,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : undefined,
        additionalNotes: body.additionalNotes,
      },
    });

    // Log update in history
    await db.bookingHistory.create({
      data: {
        bookingId,
        action: 'updated',
        details: { fields: Object.keys(body) },
        performedBy: session.email,
      },
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
