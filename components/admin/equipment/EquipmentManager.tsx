'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, ChevronUp, ChevronDown, Check, X } from 'lucide-react';
import { EquipmentItemForm } from './EquipmentItemForm';

interface EquipmentItem {
  id: number;
  name: string;
  description: string | null;
  ratePerEvent: string;
  quantityAvailable: number;
  isActive: boolean;
  sortOrder: number;
}

interface EquipmentCategory {
  id: number;
  name: string;
  sortOrder: number;
  items: EquipmentItem[];
}

interface EquipmentManagerProps {
  categories: EquipmentCategory[];
}

function formatCurrency(value: string | number): string {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function EquipmentManager({ categories: initialCategories }: EquipmentManagerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    initialCategories[0]?.id ?? 0
  );
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Item form state
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Category operations
  async function createCategory() {
    if (!newCatName.trim()) return;
    const res = await fetch('/api/admin/equipment/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCatName }),
    });
    if (res.ok) {
      setAddingCategory(false);
      setNewCatName('');
      router.refresh();
      // Re-fetch categories
      const listRes = await fetch('/api/admin/equipment/categories');
      if (listRes.ok) {
        const json = await listRes.json();
        if (json.success) setCategories(json.data);
      }
    }
  }

  async function renameCategory(catId: number) {
    if (!editCatName.trim()) return;
    const res = await fetch(`/api/admin/equipment/categories/${catId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editCatName }),
    });
    if (res.ok) {
      setCategories((prev) =>
        prev.map((c) => (c.id === catId ? { ...c, name: editCatName } : c))
      );
      setEditingCatId(null);
      setEditCatName('');
    }
  }

  async function reorderCategory(catId: number, direction: 'up' | 'down') {
    const idx = categories.findIndex((c) => c.id === catId);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= categories.length) return;

    const newOrder = [...categories];
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    setCategories(newOrder);

    // Update sort orders
    await Promise.all(
      newOrder.map((c, i) =>
        fetch(`/api/admin/equipment/categories/${c.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sortOrder: i }),
        })
      )
    );
  }

  // Item operations
  async function saveItem(data: {
    id?: number;
    name: string;
    description: string;
    ratePerEvent: string;
    quantityAvailable: string;
    isActive: boolean;
  }) {
    if (data.id) {
      // Update
      const res = await fetch(`/api/admin/equipment/items/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
          ratePerEvent: parseFloat(data.ratePerEvent),
          quantityAvailable: parseInt(data.quantityAvailable, 10),
          isActive: data.isActive,
        }),
      });
      if (!res.ok) throw new Error('Failed to update item');
    } else {
      // Create
      const res = await fetch('/api/admin/equipment/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedCategoryId,
          name: data.name,
          description: data.description || null,
          ratePerEvent: parseFloat(data.ratePerEvent),
          quantityAvailable: parseInt(data.quantityAvailable, 10),
          isActive: data.isActive,
        }),
      });
      if (!res.ok) throw new Error('Failed to create item');
    }

    router.refresh();
    // Refresh local state
    const listRes = await fetch('/api/admin/equipment/categories');
    if (listRes.ok) {
      const json = await listRes.json();
      if (json.success) setCategories(json.data);
    }
  }

  async function toggleItemActive(item: EquipmentItem) {
    const res = await fetch(`/api/admin/equipment/items/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    if (res.ok) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategoryId
            ? {
                ...cat,
                items: cat.items.map((i) =>
                  i.id === item.id ? { ...i, isActive: !i.isActive } : i
                ),
              }
            : cat
        )
      );
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Left Panel - Categories */}
      <div className="lg:col-span-1">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <h3 className="font-semibold text-gray-900">Categories</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className={`flex items-center gap-2 px-3 py-2 ${
                  selectedCategoryId === cat.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                {editingCatId === cat.id ? (
                  <div className="flex flex-1 items-center gap-1">
                    <input
                      type="text"
                      value={editCatName}
                      onChange={(e) => setEditCatName(e.target.value)}
                      className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => renameCategory(cat.id)}
                      className="rounded p-1 text-green-600 hover:bg-green-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingCatId(null)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className="flex-1 text-left text-sm font-medium text-gray-800"
                    >
                      {cat.name}
                      <span className="ml-1 text-xs text-gray-400">
                        ({cat.items.length})
                      </span>
                    </button>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => reorderCategory(cat.id, 'up')}
                        disabled={idx === 0}
                        className="rounded p-0.5 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => reorderCategory(cat.id, 'down')}
                        disabled={idx === categories.length - 1}
                        className="rounded p-0.5 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setEditCatName(cat.name);
                        }}
                        className="rounded p-0.5 text-gray-400 hover:bg-gray-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add Category */}
          <div className="border-t border-gray-100 p-3">
            {addingCategory ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={createCategory}
                  className="rounded p-1 text-green-600 hover:bg-green-50"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setAddingCategory(false)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingCategory(true)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 py-1.5 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Category
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Items */}
      <div className="lg:col-span-3">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <h3 className="font-semibold text-gray-900">
              {selectedCategory?.name ?? 'Select a category'}
            </h3>
            {selectedCategory && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowItemForm(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-900"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            )}
          </div>

          {selectedCategory && selectedCategory.items.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">
              No items in this category yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Item
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Description
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                      Rate/Event
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                      Available
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">
                      Active
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedCategory?.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">
                        {item.description || '--'}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm font-medium text-gray-700">
                        {formatCurrency(item.ratePerEvent)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {item.quantityAvailable}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => toggleItemActive(item)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            item.isActive ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              item.isActive ? 'translate-x-4.5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowItemForm(true);
                          }}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Item Form Modal */}
      {showItemForm && selectedCategory && (
        <EquipmentItemForm
          open={showItemForm}
          onClose={() => {
            setShowItemForm(false);
            setEditingItem(null);
          }}
          onSave={saveItem}
          categoryId={selectedCategory.id}
          initialData={
            editingItem
              ? {
                  id: editingItem.id,
                  name: editingItem.name,
                  description: editingItem.description ?? '',
                  ratePerEvent: String(Number(editingItem.ratePerEvent)),
                  quantityAvailable: String(editingItem.quantityAvailable),
                  isActive: editingItem.isActive,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
