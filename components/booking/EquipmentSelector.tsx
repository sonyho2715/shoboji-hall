import { useState } from "react";
import type { BookingFormData, EquipmentCategoryOption } from "./types";

interface EquipmentSelectorProps {
  data: BookingFormData["equipment"];
  categories: EquipmentCategoryOption[];
  onNext: (data: BookingFormData["equipment"]) => void;
  onBack: () => void;
}

export function EquipmentSelector({
  data,
  categories,
  onNext,
  onBack,
}: EquipmentSelectorProps) {
  const [selected, setSelected] = useState<BookingFormData["equipment"]>(data);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(categories.map((c) => c.id))
  );

  function getQuantity(equipmentId: number): number {
    return selected.find((s) => s.equipmentId === equipmentId)?.quantity ?? 0;
  }

  function updateQuantity(
    equipmentId: number,
    name: string,
    unitRate: number,
    maxQty: number,
    delta: number
  ) {
    setSelected((prev) => {
      const existing = prev.find((s) => s.equipmentId === equipmentId);
      const currentQty = existing?.quantity ?? 0;
      const newQty = Math.max(0, Math.min(maxQty, currentQty + delta));

      if (newQty === 0) {
        return prev.filter((s) => s.equipmentId !== equipmentId);
      }

      if (existing) {
        return prev.map((s) =>
          s.equipmentId === equipmentId ? { ...s, quantity: newQty } : s
        );
      }

      return [...prev, { equipmentId, quantity: newQty, unitRate, name }];
    });
  }

  function toggleCategory(id: number) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const equipmentTotal = selected.reduce(
    (sum, item) => sum + item.quantity * item.unitRate,
    0
  );

  const selectedItems = selected.filter((s) => s.quantity > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          Equipment Selection
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Add any equipment you need for your event. All rates are per event.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Equipment Catalog */}
        <div className="space-y-4 lg:col-span-2">
          {categories.map((cat) => {
            const isExpanded = expandedCategories.has(cat.id);
            const categorySelectedCount = cat.items.reduce(
              (sum, item) => sum + getQuantity(item.id),
              0
            );

            return (
              <div
                key={cat.id}
                className="overflow-hidden rounded-xl border border-stone-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-stone-50"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-stone-800">
                      {cat.name}
                    </h3>
                    {categorySelectedCount > 0 && (
                      <span className="rounded-full bg-navy-700 px-2 py-0.5 text-xs font-medium text-white">
                        {categorySelectedCount} selected
                      </span>
                    )}
                  </div>
                  <svg
                    className={`h-5 w-5 text-stone-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="border-t border-stone-100">
                    {cat.items.map((item) => {
                      const qty = getQuantity(item.id);
                      const rate = Number(item.ratePerEvent);

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between gap-4 border-b border-stone-50 px-4 py-3 last:border-b-0 ${
                            qty > 0 ? "bg-navy-700/5" : ""
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-stone-800">
                              {item.name}
                            </p>
                            {item.description && (
                              <p className="truncate text-xs text-stone-500">
                                {item.description}
                              </p>
                            )}
                            <p className="mt-0.5 text-xs font-medium text-navy-700">
                              ${rate.toFixed(0)} per event
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.name,
                                  rate,
                                  item.quantityAvailable,
                                  -1
                                )
                              }
                              disabled={qty === 0}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-300 text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                              </svg>
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-stone-800">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.name,
                                  rate,
                                  item.quantityAvailable,
                                  1
                                )
                              }
                              disabled={qty >= item.quantityAvailable}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-300 text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-stone-200 bg-white p-4">
            <h3 className="font-semibold text-stone-800">Selected Equipment</h3>

            {selectedItems.length === 0 ? (
              <p className="mt-3 text-sm text-stone-400">
                No equipment selected yet. Browse the catalog to add items.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-stone-100">
                {selectedItems.map((item) => (
                  <li
                    key={item.equipmentId}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-stone-700">{item.name}</p>
                      <p className="text-xs text-stone-500">
                        {item.quantity} x ${item.unitRate.toFixed(0)}
                      </p>
                    </div>
                    <p className="font-medium text-stone-800">
                      ${(item.quantity * item.unitRate).toFixed(0)}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 border-t border-stone-200 pt-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-stone-800">Equipment Total</p>
                <p className="text-lg font-bold text-navy-700">
                  ${equipmentTotal.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onNext(selected)}
          className="rounded-lg bg-navy-700 px-8 py-3 font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Next: Review Quote
        </button>
      </div>
    </div>
  );
}
