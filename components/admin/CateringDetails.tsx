"use client";

import { useState } from "react";

interface CateringDetailsProps {
  bookingId: number;
  serviceStyle: string | null;
  cuisines: string[];
  dietary: string | null;
  menuNotes: string | null;
  dessertNeeded: boolean;
  beverages: string[];
  cateringStatus: string;
  cateringNotifiedAt: string | null;
}

const serviceStyleLabels: Record<string, string> = {
  buffet: "Buffet",
  bento: "Bento / Individual Portions",
  dropoff: "Drop-Off / Delivery Only",
};

const cuisineLabels: Record<string, string> = {
  local: "Local Plate Lunch",
  hawaiian: "Hawaiian",
  japanese: "Japanese",
  korean: "Korean",
  american: "American Comfort",
  fusion: "Fusion",
  other: "Other",
};

const beverageLabels: Record<string, string> = {
  water_tea: "Water & Iced Tea",
  soft_drinks: "Soft Drinks",
  coffee_tea: "Coffee / Tea",
  full_service: "Full Beverage Service",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  not_requested: { label: "Not Requested", color: "bg-gray-100 text-gray-700" },
  inquiry_sent: { label: "Inquiry Sent", color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700" },
};

export function CateringDetails({
  bookingId,
  serviceStyle,
  cuisines,
  dietary,
  menuNotes,
  dessertNeeded,
  beverages,
  cateringStatus,
  cateringNotifiedAt,
}: CateringDetailsProps) {
  const [status, setStatus] = useState(cateringStatus);
  const [notifiedAt, setNotifiedAt] = useState(cateringNotifiedAt);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusInfo = statusConfig[status] || statusConfig.not_requested;
  const alreadySent = status === "inquiry_sent" || status === "confirmed";

  async function handleNotify() {
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/catering/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to send notification");
      }

      setStatus("inquiry_sent");
      setNotifiedAt(json.data.cateringNotifiedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg" role="img" aria-label="catering">&#127869;</span>
          <h3 className="font-semibold text-gray-900">Catering Details</h3>
        </div>
        <span className="text-xs text-amber-700">By Nu&#39;uanu Cookhouse</span>
      </div>

      <dl className="mt-4 space-y-2.5">
        <div className="flex justify-between text-sm">
          <dt className="text-gray-500">Service Style</dt>
          <dd className="font-medium text-gray-700">
            {serviceStyleLabels[serviceStyle || ""] || serviceStyle || "Not specified"}
          </dd>
        </div>

        <div className="flex justify-between text-sm">
          <dt className="text-gray-500">Cuisines</dt>
          <dd className="text-right font-medium text-gray-700">
            {cuisines.length > 0
              ? cuisines.map((c) => cuisineLabels[c] || c).join(", ")
              : "No preference"}
          </dd>
        </div>

        {dietary && (
          <div className="flex justify-between text-sm">
            <dt className="text-gray-500">Dietary</dt>
            <dd className="text-right font-medium text-gray-700">{dietary}</dd>
          </div>
        )}

        {menuNotes && (
          <div className="flex justify-between text-sm">
            <dt className="text-gray-500">Menu Notes</dt>
            <dd className="max-w-[60%] text-right font-medium text-gray-700">{menuNotes}</dd>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <dt className="text-gray-500">Dessert</dt>
          <dd className="font-medium text-gray-700">{dessertNeeded ? "Yes" : "No"}</dd>
        </div>

        <div className="flex justify-between text-sm">
          <dt className="text-gray-500">Beverages</dt>
          <dd className="text-right font-medium text-gray-700">
            {beverages.length > 0
              ? beverages.map((b) => beverageLabels[b] || b).join(", ")
              : "None requested"}
          </dd>
        </div>
      </dl>

      {/* Status & Action */}
      <div className="mt-4 border-t border-amber-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Status:</span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {statusInfo.label}
            </span>
          </div>
          {notifiedAt && (
            <span className="text-xs text-gray-400">
              Notified {new Date(notifiedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}

        <button
          type="button"
          onClick={handleNotify}
          disabled={sending || alreadySent}
          className={`mt-3 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            alreadySent
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60"
          }`}
        >
          {sending
            ? "Sending..."
            : alreadySent
              ? `Notified${notifiedAt ? ` on ${new Date(notifiedAt).toLocaleDateString()}` : ""}`
              : "Notify Nu'uanu Cookhouse"}
        </button>
      </div>
    </div>
  );
}
