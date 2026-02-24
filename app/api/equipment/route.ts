import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/equipment
 * Return all active equipment grouped by category, sorted by sortOrder.
 */
export async function GET() {
  try {
    const categories = await db.equipmentCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Equipment fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment' },
      { status: 500 }
    );
  }
}
