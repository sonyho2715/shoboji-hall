interface ActivityRow {
  id: number;
  eventDate: string;
  customerName: string;
  bookingType: string;
  attendees: number;
  total: number;
  bookingNumber: string;
}

interface RecentActivityTableProps {
  data: ActivityRow[];
}

const TYPE_LABELS: Record<string, string> = {
  hall_rental: 'Hall Rental',
  hall_catering: 'Hall + Catering',
  funeral_package: 'Funeral Package',
  catering_only: 'Catering Only',
};

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function RecentActivityTable({ data }: RecentActivityTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-3">
        <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
      </div>
      {data.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-400">
          No bookings found for this period
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                  Type
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                  Guests
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="whitespace-nowrap px-4 py-2.5 text-sm text-gray-700">
                    {new Date(row.eventDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                    {row.customerName}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">
                    {TYPE_LABELS[row.bookingType] || row.bookingType}
                  </td>
                  <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                    {row.attendees}
                  </td>
                  <td className="px-4 py-2.5 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(row.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
