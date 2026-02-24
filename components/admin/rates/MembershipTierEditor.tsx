'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, X, Check } from 'lucide-react';

interface MembershipTier {
  id: number;
  tierName: string;
  description: string | null;
  hallBaseRate: string | number;
  hallHourlyRate: string | number;
  eventSupportBase: string | number;
  eventSupportHourly: string | number;
  securityDeposit: string | number;
  isActive: boolean;
}

interface MembershipTierEditorProps {
  tiers: MembershipTier[];
}

function formatCurrency(value: number | string): string {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function MembershipTierEditor({ tiers: initialTiers }: MembershipTierEditorProps) {
  const router = useRouter();
  const [tiers, setTiers] = useState(initialTiers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function startEdit(tier: MembershipTier) {
    setEditingId(tier.id);
    setEditData({
      hallBaseRate: String(Number(tier.hallBaseRate)),
      hallHourlyRate: String(Number(tier.hallHourlyRate)),
      eventSupportBase: String(Number(tier.eventSupportBase)),
      eventSupportHourly: String(Number(tier.eventSupportHourly)),
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
      const res = await fetch(`/api/admin/rates/tiers/${tierId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hallBaseRate: parseFloat(editData.hallBaseRate),
          hallHourlyRate: parseFloat(editData.hallHourlyRate),
          eventSupportBase: parseFloat(editData.eventSupportBase),
          eventSupportHourly: parseFloat(editData.eventSupportHourly),
          securityDeposit: parseFloat(editData.securityDeposit),
        }),
      });

      if (res.ok) {
        // Optimistic update
        setTiers((prev) =>
          prev.map((t) =>
            t.id === tierId
              ? {
                  ...t,
                  hallBaseRate: editData.hallBaseRate,
                  hallHourlyRate: editData.hallHourlyRate,
                  eventSupportBase: editData.eventSupportBase,
                  eventSupportHourly: editData.eventSupportHourly,
                  securityDeposit: editData.securityDeposit,
                }
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

  async function toggleActive(tier: MembershipTier) {
    const res = await fetch(`/api/admin/rates/tiers/${tier.id}`, {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[700px] w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Tier</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Hall Base</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Hall/hr OT</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Support Base</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Support/hr OT</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Deposit</th>
            <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">Active</th>
            <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {tiers.map((tier) => {
            const isEditing = editingId === tier.id;

            return (
              <tr key={tier.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                  {tier.tierName}
                  {tier.description && (
                    <p className="text-xs font-normal text-gray-400">{tier.description}</p>
                  )}
                </td>
                {isEditing ? (
                  <>
                    {['hallBaseRate', 'hallHourlyRate', 'eventSupportBase', 'eventSupportHourly', 'securityDeposit'].map(
                      (field) => (
                        <td key={field} className="px-4 py-2.5">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editData[field]}
                            onChange={(e) =>
                              setEditData((prev) => ({ ...prev, [field]: e.target.value }))
                            }
                            className="w-24 rounded border border-gray-300 px-2 py-1 text-right text-sm focus:border-blue-500 focus:outline-none"
                          />
                        </td>
                      )
                    )}
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2.5 text-right text-sm text-gray-700">{formatCurrency(tier.hallBaseRate)}</td>
                    <td className="px-4 py-2.5 text-right text-sm text-gray-700">{formatCurrency(tier.hallHourlyRate)}</td>
                    <td className="px-4 py-2.5 text-right text-sm text-gray-700">{formatCurrency(tier.eventSupportBase)}</td>
                    <td className="px-4 py-2.5 text-right text-sm text-gray-700">{formatCurrency(tier.eventSupportHourly)}</td>
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
                      <button
                        onClick={() => saveEdit(tier.id)}
                        disabled={saving}
                        className="rounded p-1 text-green-600 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(tier)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
