'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BookingTypeData {
  type: string;
  count: number;
}

interface BookingTypeChartProps {
  data: BookingTypeData[];
}

const TYPE_LABELS: Record<string, string> = {
  hall_rental: 'Hall Rental',
  hall_catering: 'Hall + Catering',
  funeral_package: 'Funeral Package',
  catering_only: 'Catering Only',
};

export function BookingTypeChart({ data }: BookingTypeChartProps) {
  const formattedData = data.map((d) => ({
    ...d,
    label: TYPE_LABELS[d.type] || d.type,
  }));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Booking Types</h3>
      {formattedData.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">No data available</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              layout="vertical"
              margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                width={120}
              />
              <Tooltip
                formatter={(value: number | string | undefined) => [value ?? 0, 'Bookings']}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="count" fill="#2d6a4f" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
