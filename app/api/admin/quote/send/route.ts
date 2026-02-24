import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildQuoteData } from '@/lib/pdf/build-quote-data';
import { generateQuotePDF } from '@/lib/pdf/generate-quote';
import { sendEmail } from '@/lib/email/mailer';
import {
  buildQuoteEmailHTML,
  buildQuoteEmailText,
} from '@/lib/email/templates/quote-email';
import { format } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();

    const body = await req.json();
    const bookingId = Number(body.bookingId);
    const recipientOverride = body.recipientEmail as string | undefined;

    if (!bookingId || isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // Build quote data and generate PDF
    const quoteData = await buildQuoteData(bookingId);
    const pdfBuffer = await generateQuotePDF(quoteData);

    // Determine recipient
    const recipientEmail = recipientOverride || quoteData.customer.email;

    if (!recipientEmail) {
      return NextResponse.json(
        { success: false, error: 'No email address found for customer. Provide a recipientEmail.' },
        { status: 400 }
      );
    }

    // Build email
    const emailData = {
      customerFirstName: quoteData.customer.fullName.split(' ')[0],
      bookingNumber: quoteData.bookingNumber,
      eventDate: quoteData.event.eventDate,
      eventType: quoteData.event.eventType,
      totalAttendees: quoteData.event.totalAttendees,
      grandTotal: quoteData.grandTotal,
      securityDeposit: quoteData.securityDeposit,
    };

    // Send email with PDF attachment
    try {
      await sendEmail({
        to: recipientEmail,
        subject: `Your Event Quote - ${quoteData.bookingNumber} | Shoboji Social Hall`,
        html: buildQuoteEmailHTML(emailData),
        text: buildQuoteEmailText(emailData),
        attachments: [
          {
            filename: `Quote-${quoteData.bookingNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
    } catch (emailError) {
      console.error('Email send failed:', emailError);
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please check SMTP configuration.' },
        { status: 500 }
      );
    }

    // Update booking: set quoteSentDate and status to quoted
    await db.booking.update({
      where: { id: bookingId },
      data: {
        quoteSentDate: new Date(),
        status: 'quoted',
      },
    });

    // Log to booking history
    await db.bookingHistory.create({
      data: {
        bookingId,
        action: 'quote_sent',
        details: {
          email: recipientEmail,
          sentAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        },
        performedBy: session.name || session.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Quote sent to ${recipientEmail}`,
    });
  } catch (error) {
    console.error('Quote send error:', error);

    const message =
      error instanceof Error ? error.message : 'Failed to send quote';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
