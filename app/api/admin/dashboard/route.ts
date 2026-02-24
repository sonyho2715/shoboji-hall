import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/admin/dashboard
 * Dashboard statistics.
 */
export async function GET() {
  try {
    await requireAdmin();

    const [
      totalBookings,
      pendingInquiries,
      confirmedBookings,
      totalCustomers,
      recentBookings,
      upcomingEvents,
    ] = await Promise.all([
      db.booking.count(),
      db.booking.count({ where: { status: 'inquiry' } }),
      db.booking.count({
        where: { status: { in: ['confirmed', 'deposit_paid'] } },
      }),
      db.customer.count(),
      db.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { customer: true },
      }),
      db.booking.findMany({
        where: {
          eventDate: { gte: new Date() },
          status: { notIn: ['cancelled'] },
        },
        take: 5,
        orderBy: { eventDate: 'asc' },
        include: { customer: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        pendingInquiries,
        confirmedBookings,
        totalCustomers,
        recentBookings,
        upcomingEvents,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
