import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const blockDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  reason: z.string().optional(),
});

/**
 * POST /api/calendar/block
 * Block a date from being booked.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();

    const body = await req.json();
    const { date, reason } = blockDateSchema.parse(body);

    // Check if date is already blocked
    const existing = await db.blockedDate.findFirst({
      where: { blockedDate: new Date(date) },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'This date is already blocked' },
        { status: 409 }
      );
    }

    const blockedDate = await db.blockedDate.create({
      data: {
        blockedDate: new Date(date),
        reason: reason || null,
        blockedBy: session.email,
      },
    });

    return NextResponse.json({ success: true, data: blockedDate }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Block date error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to block date' },
      { status: 500 }
    );
  }
}
