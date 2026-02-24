import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function SettingsPage() {
  const session = await requireAdmin();

  const settings = await db.appSetting.findMany({
    orderBy: { id: 'asc' },
  });

  return (
    <>
      <AdminHeader title="Settings" adminName={session.name} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-semibold text-gray-900">
                Application Settings
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                View current system configuration
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {setting.settingKey.replace(/_/g, ' ')}
                    </p>
                    {setting.description && (
                      <p className="text-xs text-gray-400">
                        {setting.description}
                      </p>
                    )}
                  </div>
                  <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    {setting.settingValue}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900">Admin Account</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-700">{session.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-700">{session.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
