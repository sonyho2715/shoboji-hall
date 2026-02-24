import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SettingsEditor } from '@/components/admin/SettingsEditor';

export default async function SettingsPage() {
  const session = await requireAdmin();

  const settings = await db.appSetting.findMany({
    orderBy: { id: 'asc' },
  });

  const serialized = settings.map((s) => ({
    id: s.id,
    settingKey: s.settingKey,
    settingValue: s.settingValue,
    description: s.description,
  }));

  return (
    <>
      <AdminHeader title="Settings" adminName={session.name} />

      <div className="flex-1 overflow-y-auto p-6">
        <SettingsEditor
          settings={serialized}
          adminName={session.name}
          adminEmail={session.email}
        />
      </div>
    </>
  );
}
