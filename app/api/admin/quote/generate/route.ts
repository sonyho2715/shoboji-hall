import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { buildQuoteData } from '@/lib/pdf/build-quote-data';
import { generateQuotePDF } from '@/lib/pdf/generate-quote';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const bookingId = Number(body.bookingId);

    if (!bookingId || isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    const quoteData = await buildQuoteData(bookingId);
    const pdfBuffer = await generateQuotePDF(quoteData);

    const filename = `Quote-${quoteData.bookingNumber}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error('Quote generation error:', error);

    const message =
      error instanceof Error ? error.message : 'Failed to generate quote';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
