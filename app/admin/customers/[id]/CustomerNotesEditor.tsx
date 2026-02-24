'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CustomerNotesEditorProps {
  customerId: number;
  initialNotes: string;
}

export function CustomerNotesEditor({
  customerId,
  initialNotes,
}: CustomerNotesEditorProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
        placeholder="Notes about this customer..."
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Notes'}
        </button>
        {saved && (
          <span className="text-sm text-green-600">Saved</span>
        )}
      </div>
    </div>
  );
}
