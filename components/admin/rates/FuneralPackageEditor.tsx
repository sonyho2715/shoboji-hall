'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, X, Check } from 'lucide-react';

interface FuneralPackageTier {
  id: number;
  tierName: string;
  attendeeRange: string;
  minAttendees: number;
  maxAttendees: number;
  rate: string | number;
  securityDeposit: string | number;
  isActive: boolean;
}

interface FuneralPackageEditorProps {
  tiers: FuneralPackageTier[];
}

function formatCurrency(value: number | string): string {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function FuneralPackageEditor({ tiers: initialTiers }: FuneralPackageEditorProps) {
  const router = useRouter();
  const [tiers, setTiers] = useState(initialTiers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function startEdit(tier: FuneralPackageTier) {
    setEditingId(tier.id);
    setEditData({
      rate: String(Number(tier.rate)),
      securityDeposit: String(Number(tier.securityDeposit)),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  async function saveEdit(tierId: number) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/rates/funeral/${tierId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rate: parseFloat(editData.rate),
          securityDeposit: parseFloat(editData.securityDeposit),
        }),
      });

      if (res.ok) {
        setTiers((prev) =>
          prev.map((t) =>
            t.id === tierId
              ? { ...t, rate: editData.rate, securityDeposit: editData.securityDeposit }
              : t
          )
        );
        setEditingId(null);
        setEditData({});
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(tier: FuneralPackageTier) {
    const res = await fetch(`/api/admin/rates/funeral/${tier.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !tier.isActive }),
    });

    if (res.ok) {
      setTiers((prev) =>
        prev.map((t) => (t.id === tier.id ? { ...t, isActive: !t.isActive } : t))
      );
      router.refresh();
    }
  }

  // Group by tier name
  const grouped = new Map<string, FuneralPackageTier[]>();
  for (const tier of tiers) {
    const existing = grouped.get(tier.tierName) ?? [];
    existing.push(tier);
    grouped.set(tier.tierName, existing);
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[600px] w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Tier</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Attendee Range</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Rate</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Deposit</th>
            <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">Active</th>
            <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {Array.from(grouped.entries()).map(([tierName, tierGroup]) => (
            tierGroup.map((tier, idx) => {
              const isEditing = editingId === tier.id;

              return (
                <tr key={tier.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                    {idx === 0 ? tierName : ''}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">
                    {tier.minAttendees}--{tier.maxAttendees} guests
                  </td>
                  {isEditing ? (
                    <>
                      <td className="px-4 py-2.5">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editData.rate}
                          onChange={(e) => setEditData((prev) => ({ ...prev, rate: e.target.value }))}
                          className="w-24 rounded border border-gray-300 px-2 py-1 text-right text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editData.securityDeposit}
                          onChange={(e) => setEditData((prev) => ({ ...prev, securityDeposit: e.target.value }))}
                          className="w-24 rounded border border-gray-300 px-2 py-1 text-right text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">{formatCurrency(tier.rate)}</td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">{formatCurrency(tier.securityDeposit)}</td>
                    </>
                  )}
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => toggleActive(tier)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        tier.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          tier.isActive ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => saveEdit(tier.id)} disabled={saving} className="rounded p-1 text-green-600 hover:bg-green-50">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={cancelEdit} className="rounded p-1 text-gray-400 hover:bg-gray-100">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(tier)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ))}
        </tbody>
      </table>
    </div>
  );
}
