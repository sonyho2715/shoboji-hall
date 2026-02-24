import { DollarSign, Calendar, TrendingUp, CheckCircle } from 'lucide-react';

interface StatsGridProps {
  totalRevenue: number;
  totalBookings: number;
  avgBookingValue: number;
  completedEvents: number;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function StatsGrid({
  totalRevenue,
  totalBookings,
  avgBookingValue,
  completedEvents,
}: StatsGridProps) {
  const stats = [
    {
      label: 'YTD Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'bg-green-100 text-green-700',
      valueColor: 'text-green-700',
    },
    {
      label: 'Total Bookings',
      value: totalBookings.toString(),
      icon: Calendar,
      color: 'bg-blue-100 text-blue-700',
      valueColor: 'text-gray-900',
    },
    {
      label: 'Avg Booking Value',
      value: formatCurrency(avgBookingValue),
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-700',
      valueColor: 'text-gray-900',
    },
    {
      label: 'Completed Events',
      value: completedEvents.toString(),
      icon: CheckCircle,
      color: 'bg-emerald-100 text-emerald-700',
      valueColor: 'text-gray-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${stat.valueColor}`}>
                {stat.value}
              </p>
            </div>
            <div className={`rounded-lg p-2.5 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
