import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * GET /api/admin/reports?year=2026
 * Returns computed report data for client-side year filtering.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()), 10);

    const bookings = await db.booking.findMany({
      where: {
        eventDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
        status: { notIn: ['cancelled'] },
      },
      include: { customer: true, membershipTier: true },
      orderBy: { eventDate: 'asc' },
    });

    // Monthly revenue
    const monthlyRevenue = MONTH_NAMES.map((month, idx) => {
      const monthBookings = bookings.filter((b) => {
        const d = new Date(b.eventDate);
        return d.getMonth() === idx;
      });
      return {
        month,
        totalRevenue: monthBookings.reduce((sum, b) => sum + Number(b.grandTotal), 0),
        bookingCount: monthBookings.length,
      };
    });

    // Tier breakdown
    const tierMap = new Map<string, { totalRevenue: number; bookingCount: number }>();
    for (const b of bookings) {
      const tierName = b.membershipTier?.tierName ?? 'Unknown';
      const existing = tierMap.get(tierName) ?? { totalRevenue: 0, bookingCount: 0 };
      existing.totalRevenue += Number(b.grandTotal);
      existing.bookingCount += 1;
      tierMap.set(tierName, existing);
    }

    // Booking types
    const typeMap = new Map<string, number>();
    for (const b of bookings) {
      typeMap.set(b.bookingType, (typeMap.get(b.bookingType) ?? 0) + 1);
    }

    // Totals
    const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.grandTotal), 0);
    const totalBookings = bookings.length;

    return NextResponse.json({
      success: true,
      data: {
        year,
        monthlyRevenue,
        tierBreakdown: Array.from(tierMap.entries()).map(([tierName, data]) => ({
          tierName,
          ...data,
        })),
        bookingTypes: Array.from(typeMap.entries()).map(([type, count]) => ({
          type,
          count,
        })),
        totals: {
          totalRevenue,
          totalBookings,
          avgBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
          completedEvents: bookings.filter((b) => b.status === 'completed').length,
        },
      },
    });
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
