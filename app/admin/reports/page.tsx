import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsGrid } from '@/components/admin/reports/StatsGrid';
import { RevenueChart } from '@/components/admin/reports/RevenueChart';
import { TierBreakdownChart } from '@/components/admin/reports/TierBreakdownChart';
import { BookingTypeChart } from '@/components/admin/reports/BookingTypeChart';
import { RecentActivityTable } from '@/components/admin/reports/RecentActivityTable';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default async function ReportsPage() {
  const session = await requireAdmin();
  const currentYear = new Date().getFullYear();

  const bookings = await db.booking.findMany({
    where: {
      eventDate: {
        gte: new Date(`${currentYear}-01-01`),
        lte: new Date(`${currentYear}-12-31`),
      },
      status: { notIn: ['cancelled'] },
    },
    include: { customer: true, membershipTier: true },
    orderBy: { eventDate: 'asc' },
  });

  // 1. Monthly revenue
  const monthlyRevenue = MONTH_NAMES.map((month, idx) => {
    const monthBookings = bookings.filter((b) => {
      const d = new Date(b.eventDate);
      return d.getMonth() === idx;
    });
    const totalRevenue = monthBookings.reduce(
      (sum, b) => sum + Number(b.grandTotal),
      0
    );
    return {
      month,
      totalRevenue,
      bookingCount: monthBookings.length,
    };
  });

  // 2. Revenue by membership tier
  const tierMap = new Map<string, { totalRevenue: number; bookingCount: number }>();
  for (const b of bookings) {
    const tierName = b.membershipTier?.tierName ?? 'Unknown';
    const existing = tierMap.get(tierName) ?? { totalRevenue: 0, bookingCount: 0 };
    existing.totalRevenue += Number(b.grandTotal);
    existing.bookingCount += 1;
    tierMap.set(tierName, existing);
  }
  const tierBreakdown = Array.from(tierMap.entries()).map(([tierName, data]) => ({
    tierName,
    ...data,
  }));

  // 3. Booking status distribution
  const statusMap = new Map<string, number>();
  for (const b of bookings) {
    statusMap.set(b.status, (statusMap.get(b.status) ?? 0) + 1);
  }

  // 4. Booking type breakdown
  const typeMap = new Map<string, number>();
  for (const b of bookings) {
    typeMap.set(b.bookingType, (typeMap.get(b.bookingType) ?? 0) + 1);
  }
  const bookingTypeData = Array.from(typeMap.entries()).map(([type, count]) => ({
    type,
    count,
  }));

  // 5. Top referral sources
  const referralMap = new Map<string, number>();
  for (const b of bookings) {
    if (b.referralSource) {
      referralMap.set(b.referralSource, (referralMap.get(b.referralSource) ?? 0) + 1);
    }
  }
  const topReferrals = Array.from(referralMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 6. YTD totals
  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.grandTotal), 0);
  const totalBookings = bookings.length;
  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
  const completedEvents = bookings.filter((b) => b.status === 'completed').length;

  // 7. Recent bookings for table
  const recentActivity = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed' || b.status === 'deposit_paid')
    .slice(-20)
    .reverse()
    .map((b) => ({
      id: b.id,
      eventDate: b.eventDate.toISOString(),
      customerName: b.customer.fullName,
      bookingType: b.bookingType,
      attendees: b.adultCount + b.childCount,
      total: Number(b.grandTotal),
      bookingNumber: b.bookingNumber,
    }));

  return (
    <>
      <AdminHeader title="Reports & Analytics" adminName={session.name} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Year-to-date overview for {currentYear}
          </p>
        </div>

        {/* KPI Stats */}
        <StatsGrid
          totalRevenue={totalRevenue}
          totalBookings={totalBookings}
          avgBookingValue={avgBookingValue}
          completedEvents={completedEvents}
        />

        {/* Charts Row */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueChart data={monthlyRevenue} />
          <TierBreakdownChart data={tierBreakdown} />
        </div>

        {/* Booking Type + Referral Sources */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BookingTypeChart data={bookingTypeData} />

          {/* Referral Sources */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Top Referral Sources</h3>
            {topReferrals.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">
                No referral data available
              </p>
            ) : (
              <div className="space-y-3">
                {topReferrals.map(([source, count]) => {
                  const maxCount = topReferrals[0][1];
                  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={source}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize text-gray-700">
                          {source.replace(/_/g, ' ')}
                        </span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-navy-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="mt-6">
          <RecentActivityTable data={recentActivity} />
        </div>
      </div>
    </>
  );
}
