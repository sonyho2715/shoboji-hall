import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/rates/tiers
 * Return all active membership tiers.
 */
export async function GET() {
  try {
    const tiers = await db.membershipTier.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: tiers,
    });
  } catch (error) {
    console.error('Tiers fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch membership tiers' },
      { status: 500 }
    );
  }
}
