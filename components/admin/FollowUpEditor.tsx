'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FollowUpEditorProps {
  bookingId: number;
  initialDate: string | null;
  initialStaff: string | null;
}

export function FollowUpEditor({
  bookingId,
  initialDate,
  initialStaff,
}: FollowUpEditorProps) {
  const router = useRouter();
  const [followUpDate, setFollowUpDate] = useState(initialDate || '');
  const [assignedStaff, setAssignedStaff] = useState(initialStaff || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followUpDate: followUpDate || null,
          assignedStaff: assignedStaff || null,
        }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          Follow-up Date
        </label>
        <input
          type="date"
          value={followUpDate}
          onChange={(e) => setFollowUpDate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          Assigned Staff
        </label>
        <input
          type="text"
          value={assignedStaff}
          onChange={(e) => setAssignedStaff(e.target.value)}
          placeholder="Staff name"
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
