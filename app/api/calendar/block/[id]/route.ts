import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

/**
 * DELETE /api/calendar/block/[id]
 * Remove a blocked date.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const blockedDateId = parseInt(id, 10);

    if (isNaN(blockedDateId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid blocked date ID' },
        { status: 400 }
      );
    }

    const existing = await db.blockedDate.findUnique({
      where: { id: blockedDateId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Blocked date not found' },
        { status: 404 }
      );
    }

    await db.blockedDate.delete({
      where: { id: blockedDateId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unblock date error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unblock date' },
      { status: 500 }
    );
  }
}
