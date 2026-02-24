import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email/mailer';
import {
  buildConfirmationEmailHTML,
  buildConfirmationEmailText,
} from '@/lib/email/templates/confirmation-email';
import { format } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();

    const body = await req.json();
    const bookingId = Number(body.bookingId);

    if (!bookingId || isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
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

    const recipientEmail = booking.customer.email;

    if (!recipientEmail) {
      return NextResponse.json(
        { success: false, error: 'No email address found for customer' },
        { status: 400 }
      );
    }

    // Format times for display
    const startTime = new Date(booking.eventStartTime);
    const endTime = new Date(booking.eventEndTime);

    const emailData = {
      customerFirstName: booking.customer.fullName.split(' ')[0],
      bookingNumber: booking.bookingNumber,
      eventDate: format(new Date(booking.eventDate), 'MMMM d, yyyy'),
      eventStartTime: formatTimeDisplay(startTime),
      eventEndTime: formatTimeDisplay(endTime),
      eventType: booking.eventType || 'Event',
      totalAttendees: booking.adultCount + booking.childCount,
      grandTotal: Number(booking.grandTotal),
    };

    try {
      await sendEmail({
        to: recipientEmail,
        subject: `Booking Confirmed - ${booking.bookingNumber} | Shoboji Social Hall`,
        html: buildConfirmationEmailHTML(emailData),
        text: buildConfirmationEmailText(emailData),
      });
    } catch (emailError) {
      console.error('Confirmation email send failed:', emailError);
      return NextResponse.json(
        { success: false, error: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

    // Log to booking history
    await db.bookingHistory.create({
      data: {
        bookingId,
        action: 'confirmation_email_sent',
        details: {
          email: recipientEmail,
          sentAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        },
        performedBy: session.name || session.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Confirmation email sent to ${recipientEmail}`,
    });
  } catch (error) {
    console.error('Confirmation email error:', error);

    const message =
      error instanceof Error ? error.message : 'Failed to send confirmation email';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

function formatTimeDisplay(time: Date): string {
  const hours = time.getUTCHours();
  const minutes = time.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const min = minutes.toString().padStart(2, '0');
  return `${h12}:${min} ${ampm}`;
}
