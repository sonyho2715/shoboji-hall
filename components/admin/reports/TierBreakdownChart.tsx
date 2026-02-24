'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface TierData {
  tierName: string;
  totalRevenue: number;
  bookingCount: number;
}

interface TierBreakdownChartProps {
  data: TierData[];
}

const COLORS = ['#162d4a', '#2d6a4f', '#1e3a5f', '#245a42', '#44403c', '#78716c'];

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: TierData & { totalRevenue: number; bookingCount: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
      <p className="mt-1 text-sm text-gray-600">
        Revenue: <span className="font-medium">{formatCurrency(item.payload.totalRevenue)}</span>
      </p>
      <p className="text-sm text-gray-600">
        Bookings: <span className="font-medium">{item.payload.bookingCount}</span>
      </p>
    </div>
  );
}

export function TierBreakdownChart({ data }: TierBreakdownChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.totalRevenue, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Revenue by Membership Tier</h3>
      {data.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">No data available</p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="totalRevenue"
                nameKey="tierName"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value: string) => {
                  const tier = data.find((d) => d.tierName === value);
                  if (!tier || totalRevenue === 0) return value;
                  const pct = ((tier.totalRevenue / totalRevenue) * 100).toFixed(0);
                  return `${value} (${pct}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
