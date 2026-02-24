import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sendCateringNotification } from '@/lib/email/send-catering-notification';
import { format } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const bookingId = body.bookingId;

    if (!bookingId || typeof bookingId !== 'number') {
      return NextResponse.json(
        { success: false, error: 'bookingId is required' },
        { status: 400 }
      );
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    const cateringEmail =
      process.env.CATERING_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'catering@shoboji.org';

    // Send notification
    await sendCateringNotification({
      bookingNumber: booking.bookingNumber,
      eventDate: format(new Date(booking.eventDate), 'MMMM d, yyyy'),
      eventStartTime: format(new Date(booking.eventStartTime), 'HH:mm'),
      eventEndTime: format(new Date(booking.eventEndTime), 'HH:mm'),
      eventType: booking.eventType || 'Event',
      totalAttendees: booking.adultCount + booking.childCount,
      customerName: booking.customer.fullName,
      customerPhone: booking.customer.phone || undefined,
      customerEmail: booking.customer.email || undefined,
      serviceStyle: booking.cateringServiceStyle || 'Not specified',
      cuisines: (booking.cateringCuisines as string[]) || [],
      dietary: booking.cateringDietary || 'None specified',
      menuNotes: booking.cateringMenuNotes || 'None',
      dessertNeeded: booking.cateringDessert,
      beverages: (booking.cateringBeverages as string[]) || [],
      budgetRange: booking.budgetRange || 'Not specified',
    });

    // Update booking status
    await db.booking.update({
      where: { id: bookingId },
      data: {
        cateringStatus: 'inquiry_sent',
        cateringNotifiedAt: new Date(),
      },
    });

    // Log to booking history
    await db.bookingHistory.create({
      data: {
        bookingId,
        action: 'catering_notified',
        details: { email: cateringEmail },
        performedBy: 'admin',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        cateringStatus: 'inquiry_sent',
        cateringNotifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Catering notify error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send catering notification' },
      { status: 500 }
    );
  }
}
