import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';

function formatCurrency(value: number | { toString(): string }): string {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function EquipmentPage() {
  const session = await requireAdmin();

  const categories = await db.equipmentCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  return (
    <>
      <AdminHeader title="Equipment" adminName={session.name} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="border-b border-gray-100 px-5 py-3">
                <h2 className="font-semibold text-gray-900">
                  {category.name}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                        Item
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                        Description
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                        Rate/Event
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                        Available
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">
                        Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {category.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-gray-500">
                          {item.description || '--'}
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm font-medium text-gray-700">
                          {formatCurrency(item.ratePerEvent)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                          {item.quantityAvailable}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {item.isActive ? (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                              Yes
                            </span>
                          ) : (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                              No
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
