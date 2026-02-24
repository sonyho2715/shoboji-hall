'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Lock } from 'lucide-react';

interface AppSettingRow {
  id: number;
  settingKey: string;
  settingValue: string;
  description: string | null;
}

interface SettingsEditorProps {
  settings: AppSettingRow[];
  adminName: string;
  adminEmail: string;
}

const SETTING_CONFIG: Record<string, { label: string; type: 'time' | 'number' | 'text' | 'toggle' }> = {
  operating_hours_start: { label: 'Opening Time', type: 'time' },
  operating_hours_end: { label: 'Closing Time', type: 'time' },
  base_hours_included: { label: 'Base Hours Included', type: 'number' },
  booking_number_prefix: { label: 'Booking Number Prefix', type: 'text' },
  annual_membership_fee: { label: 'Annual Membership Fee ($)', type: 'number' },
  alcohol_requires_police: { label: 'Require HPD for Alcohol Events', type: 'toggle' },
};

export function SettingsEditor({ settings, adminName, adminEmail }: SettingsEditorProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(settings.map((s) => [s.settingKey, s.settingValue]))
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  async function handleSaveSettings() {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: values }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        router.refresh();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters');
      return;
    }

    setPwSaving(true);
    try {
      const res = await fetch('/api/admin/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setPwSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPwSuccess(false), 3000);
      } else {
        setPwError(json.error || 'Failed to change password');
      }
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* App Settings */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Application Settings</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage system configuration
          </p>
        </div>
        <div className="divide-y divide-gray-100 px-5">
          {settings.map((setting) => {
            const config = SETTING_CONFIG[setting.settingKey];
            const label = config?.label ?? setting.settingKey.replace(/_/g, ' ');
            const type = config?.type ?? 'text';

            return (
              <div
                key={setting.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="text-sm font-medium capitalize text-gray-900">
                    {label}
                  </p>
                  {setting.description && (
                    <p className="text-xs text-gray-400">{setting.description}</p>
                  )}
                </div>
                <div>
                  {type === 'toggle' ? (
                    <button
                      type="button"
                      onClick={() =>
                        setValues((prev) => ({
                          ...prev,
                          [setting.settingKey]:
                            prev[setting.settingKey] === 'true' ? 'false' : 'true',
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        values[setting.settingKey] === 'true'
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          values[setting.settingKey] === 'true'
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : type === 'time' ? (
                    <input
                      type="time"
                      value={values[setting.settingKey] ?? ''}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [setting.settingKey]: e.target.value,
                        }))
                      }
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  ) : type === 'number' ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={values[setting.settingKey] ?? ''}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [setting.settingKey]: e.target.value,
                        }))
                      }
                      className="w-28 rounded-lg border border-gray-300 px-3 py-1.5 text-right text-sm focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[setting.settingKey] ?? ''}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [setting.settingKey]: e.target.value,
                        }))
                      }
                      className="w-40 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          {saveSuccess && (
            <p className="text-sm font-medium text-green-600">Settings saved</p>
          )}
          {!saveSuccess && <div />}
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Admin Account */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Admin Account</h2>
        </div>
        <div className="px-5 py-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-gray-700">{adminName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-700">{adminEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="flex items-center gap-2 font-semibold text-gray-900">
            <Lock className="h-4 w-4" />
            Change Password
          </h2>
        </div>
        <form onSubmit={handleChangePassword} className="px-5 py-4">
          {pwError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              Password changed successfully
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={pwSaving}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
            >
              {pwSaving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
