'use client';

import { useState } from 'react';
import { Modal } from '@/components/admin/Modal';

interface EquipmentItemData {
  id?: number;
  name: string;
  description: string;
  ratePerEvent: string;
  quantityAvailable: string;
  isActive: boolean;
}

interface EquipmentItemFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EquipmentItemData) => Promise<void>;
  initialData?: EquipmentItemData;
  categoryId: number;
}

export function EquipmentItemForm({
  open,
  onClose,
  onSave,
  initialData,
}: EquipmentItemFormProps) {
  const [form, setForm] = useState<EquipmentItemData>(
    initialData ?? {
      name: '',
      description: '',
      ratePerEvent: '0',
      quantityAvailable: '1',
      isActive: true,
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    if (parseFloat(form.ratePerEvent) < 0) {
      setError('Rate must be a positive number');
      return;
    }
    if (parseInt(form.quantityAvailable, 10) < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData?.id ? 'Edit Equipment Item' : 'Add Equipment Item'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rate Per Event ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.ratePerEvent}
              onChange={(e) => setForm({ ...form, ratePerEvent: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity Available <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={form.quantityAvailable}
              onChange={(e) => setForm({ ...form, quantityAvailable: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Active</label>
          <button
            type="button"
            onClick={() => setForm({ ...form, isActive: !form.isActive })}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              form.isActive ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                form.isActive ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
          >
            {saving ? 'Saving...' : initialData?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
