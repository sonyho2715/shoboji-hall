import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { EquipmentManager } from '@/components/admin/equipment/EquipmentManager';

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

  // Serialize Decimal fields for client component
  const serialized = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    sortOrder: cat.sortOrder,
    items: cat.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      ratePerEvent: String(item.ratePerEvent),
      quantityAvailable: item.quantityAvailable,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    })),
  }));

  return (
    <>
      <AdminHeader title="Equipment" adminName={session.name} />

      <div className="flex-1 overflow-y-auto p-6">
        <EquipmentManager categories={serialized} />
      </div>
    </>
  );
}
