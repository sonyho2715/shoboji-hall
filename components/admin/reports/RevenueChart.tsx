'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';

interface MonthlyData {
  month: string;
  totalRevenue: number;
  bookingCount: number;
}

interface RevenueChartProps {
  data: MonthlyData[];
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

interface TooltipPayloadItem {
  value: number;
  dataKey: string;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const revenue = payload.find((p) => p.dataKey === 'totalRevenue');
  const count = payload.find((p) => p.dataKey === 'bookingCount');

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      {revenue && (
        <p className="mt-1 text-sm text-gray-600">
          Revenue: <span className="font-medium">{formatCurrency(revenue.value)}</span>
        </p>
      )}
      {count && (
        <p className="text-sm text-gray-600">
          Bookings: <span className="font-medium">{count.value}</span>
        </p>
      )}
    </div>
  );
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Monthly Revenue</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="left"
              dataKey="totalRevenue"
              fill="#162d4a"
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bookingCount"
              stroke="#2d6a4f"
              strokeWidth={2}
              dot={{ fill: '#2d6a4f', r: 4 }}
              name="Bookings"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
