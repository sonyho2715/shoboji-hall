'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, X, Check, Plus } from 'lucide-react';

interface ServiceRate {
  id: number;
  roleName: string;
  ratePerHour: string | number | null;
  rateType: string;
  commissionPct: string | number | null;
  minHours: number;
  notes: string | null;
  isActive: boolean;
}

interface ServiceRatesEditorProps {
  services: ServiceRate[];
}

function formatRate(svc: ServiceRate): string {
  if (svc.rateType === 'commission') return `${Number(svc.commissionPct)}%`;
  if (svc.rateType === 'included') return 'Included';
  if (svc.ratePerHour) return `$${Number(svc.ratePerHour).toFixed(2)}/hr`;
  return '--';
}

interface EditState {
  roleName: string;
  rateType: string;
  ratePerHour: string;
  commissionPct: string;
  minHours: string;
  notes: string;
}

export function ServiceRatesEditor({ services: initialServices }: ServiceRatesEditorProps) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [newData, setNewData] = useState<EditState>({
    roleName: '',
    rateType: 'hourly',
    ratePerHour: '0',
    commissionPct: '0',
    minHours: '2',
    notes: '',
  });

  function startEdit(svc: ServiceRate) {
    setEditingId(svc.id);
    setEditData({
      roleName: svc.roleName,
      rateType: svc.rateType,
      ratePerHour: String(Number(svc.ratePerHour ?? 0)),
      commissionPct: String(Number(svc.commissionPct ?? 0)),
      minHours: String(svc.minHours),
      notes: svc.notes ?? '',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData(null);
  }

  async function saveEdit(svcId: number) {
    if (!editData) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/rates/services/${svcId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleName: editData.roleName,
          rateType: editData.rateType,
          ratePerHour: editData.rateType === 'hourly' || editData.rateType === 'flat' ? parseFloat(editData.ratePerHour) : null,
          commissionPct: editData.rateType === 'commission' ? parseFloat(editData.commissionPct) : null,
          minHours: parseInt(editData.minHours, 10),
          notes: editData.notes || null,
        }),
      });

      if (res.ok) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === svcId
              ? {
                  ...s,
                  roleName: editData.roleName,
                  rateType: editData.rateType,
                  ratePerHour: editData.ratePerHour,
                  commissionPct: editData.commissionPct,
                  minHours: parseInt(editData.minHours, 10),
                  notes: editData.notes || null,
                }
              : s
          )
        );
        setEditingId(null);
        setEditData(null);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(svc: ServiceRate) {
    const res = await fetch(`/api/admin/rates/services/${svc.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !svc.isActive }),
    });

    if (res.ok) {
      setServices((prev) =>
        prev.map((s) => (s.id === svc.id ? { ...s, isActive: !s.isActive } : s))
      );
      router.refresh();
    }
  }

  async function createService() {
    if (!newData.roleName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/rates/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleName: newData.roleName,
          rateType: newData.rateType,
          ratePerHour: newData.rateType === 'hourly' || newData.rateType === 'flat' ? parseFloat(newData.ratePerHour) : null,
          commissionPct: newData.rateType === 'commission' ? parseFloat(newData.commissionPct) : null,
          minHours: parseInt(newData.minHours, 10),
          notes: newData.notes || null,
        }),
      });

      if (res.ok) {
        setAddingNew(false);
        setNewData({
          roleName: '',
          rateType: 'hourly',
          ratePerHour: '0',
          commissionPct: '0',
          minHours: '2',
          notes: '',
        });
        router.refresh();
        // Re-fetch the updated list
        const listRes = await fetch('/api/admin/rates/services');
        if (listRes.ok) {
          const json = await listRes.json();
          if (json.success) setServices(json.data);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  function renderEditFields(data: EditState, onChange: (d: EditState) => void) {
    return (
      <>
        <td className="px-4 py-2.5">
          <input
            type="text"
            value={data.roleName}
            onChange={(e) => onChange({ ...data, roleName: e.target.value })}
            className="w-28 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
          />
        </td>
        <td className="px-4 py-2.5">
          {data.rateType === 'commission' ? (
            <input
              type="number"
              step="0.1"
              min="0"
              value={data.commissionPct}
              onChange={(e) => onChange({ ...data, commissionPct: e.target.value })}
              className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm focus:border-blue-500 focus:outline-none"
              placeholder="%"
            />
          ) : data.rateType === 'included' ? (
            <span className="text-sm text-gray-400">Included</span>
          ) : (
            <input
              type="number"
              step="0.01"
              min="0"
              value={data.ratePerHour}
              onChange={(e) => onChange({ ...data, ratePerHour: e.target.value })}
              className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm focus:border-blue-500 focus:outline-none"
            />
          )}
        </td>
        <td className="px-4 py-2.5">
          <select
            value={data.rateType}
            onChange={(e) => onChange({ ...data, rateType: e.target.value })}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="hourly">hourly</option>
            <option value="flat">flat</option>
            <option value="commission">commission</option>
            <option value="included">included</option>
          </select>
        </td>
        <td className="px-4 py-2.5">
          <input
            type="number"
            min="0"
            value={data.minHours}
            onChange={(e) => onChange({ ...data, minHours: e.target.value })}
            className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none"
          />
        </td>
      </>
    );
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          onClick={() => setAddingNew(true)}
          disabled={addingNew}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-900 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add New Service
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Role</th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Rate</th>
              <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">Type</th>
              <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">Min Hours</th>
              <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">Active</th>
              <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {/* New row */}
            {addingNew && (
              <tr className="bg-blue-50/50">
                {renderEditFields(newData, setNewData)}
                <td className="px-4 py-2.5 text-center">
                  <span className="text-xs text-gray-400">--</span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={createService} disabled={saving} className="rounded p-1 text-green-600 hover:bg-green-50">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setAddingNew(false)} className="rounded p-1 text-gray-400 hover:bg-gray-100">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {services.map((svc) => {
              const isEditing = editingId === svc.id;

              return (
                <tr key={svc.id} className="hover:bg-gray-50/50">
                  {isEditing && editData ? (
                    renderEditFields(editData, setEditData)
                  ) : (
                    <>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{svc.roleName}</td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">{formatRate(svc)}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
                          {svc.rateType}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center text-sm text-gray-700">
                        {svc.minHours > 0 ? svc.minHours : '--'}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => toggleActive(svc)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        svc.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          svc.isActive ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => saveEdit(svc.id)} disabled={saving} className="rounded p-1 text-green-600 hover:bg-green-50">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={cancelEdit} className="rounded p-1 text-gray-400 hover:bg-gray-100">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(svc)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
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
    </div>
  );
}
