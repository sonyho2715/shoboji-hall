import { useEffect, useState, useCallback } from "react";
import type { BookingFormData, MembershipTierOption } from "./types";

interface QuoteData {
  hallRentalTotal: number;
  eventSupportTotal: number;
  requiredStaff: number;
  equipmentTotal: number;
  servicesTotal: number;
  securityDeposit: number;
  grandTotal: number;
  eventDurationHours: number;
  tierName: string;
  hpdCost: number;
  hpdIncluded: boolean;
  breakdown: {
    hallBaseRate: number;
    hallOvertimeHours: number;
    hallOvertimeCost: number;
    supportBaseRate: number;
    supportOvertimeHours: number;
    supportOvertimeCost: number;
  };
}

interface QuotePreviewProps {
  formData: BookingFormData;
  tiers: MembershipTierOption[];
  onSubmit: () => void;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  isSubmitting: boolean;
  submitError: string | null;
}

function formatCurrency(n: number): string {
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function QuotePreview({
  formData,
  tiers,
  onSubmit,
  onBack,
  onGoToStep,
  isSubmitting,
  submitError,
}: QuotePreviewProps) {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const totalAttendees =
        formData.eventDetails.adultCount + formData.eventDetails.childCount;

      const res = await fetch("/api/calculate/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipTierId: formData.clientInfo.membershipTierId,
          eventDate: formData.eventDetails.eventDate,
          eventStartTime: formData.eventDetails.eventStartTime,
          eventEndTime: formData.eventDetails.eventEndTime,
          totalAttendees,
          isFuneralPackage:
            formData.venueRequirements.bookingType === "funeral_package",
          alcoholServed: formData.venueRequirements.alcoholServed,
          equipmentItems: formData.equipment.map((e) => ({
            quantity: e.quantity,
            unitRate: e.unitRate,
          })),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to calculate quote");
      }

      setQuote(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quote");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const selectedTier = tiers.find(
    (t) => t.id === formData.clientInfo.membershipTierId
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-navy-700" />
        <p className="mt-4 text-sm text-stone-500">Calculating your quote...</p>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-800">Unable to calculate quote</p>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={fetchQuote}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          Your Quote Summary
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Review your event details and estimated costs below.
        </p>
      </div>

      {/* Event Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Client Info */}
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-800">Contact Info</h3>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-xs font-medium text-navy-700 hover:underline"
            >
              Edit
            </button>
          </div>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-500">Name</dt>
              <dd className="font-medium text-stone-800">
                {formData.clientInfo.fullName}
              </dd>
            </div>
            {formData.clientInfo.organization && (
              <div className="flex justify-between">
                <dt className="text-stone-500">Organization</dt>
                <dd className="font-medium text-stone-800">
                  {formData.clientInfo.organization}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-stone-500">Tier</dt>
              <dd className="font-medium text-stone-800">
                {selectedTier?.tierName ?? "Unknown"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Member</dt>
              <dd className="font-medium text-stone-800">
                {formData.clientInfo.isMember ? "Yes" : "No"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Event Details */}
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-800">Event Details</h3>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="text-xs font-medium text-navy-700 hover:underline"
            >
              Edit
            </button>
          </div>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-500">Event</dt>
              <dd className="font-medium text-stone-800">
                {formData.eventDetails.eventType}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Date</dt>
              <dd className="font-medium text-stone-800">
                {new Date(
                  formData.eventDetails.eventDate + "T00:00:00"
                ).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Time</dt>
              <dd className="font-medium text-stone-800">
                {formData.eventDetails.eventStartTime} -{" "}
                {formData.eventDetails.eventEndTime}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Duration</dt>
              <dd className="font-medium text-stone-800">
                {quote.eventDurationHours} hours
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Guests</dt>
              <dd className="font-medium text-stone-800">
                {formData.eventDetails.adultCount +
                  formData.eventDetails.childCount}{" "}
                ({formData.eventDetails.adultCount} adults
                {formData.eventDetails.childCount > 0 &&
                  `, ${formData.eventDetails.childCount} children`}
                )
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Venue Summary */}
      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">Venue</h3>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="text-xs font-medium text-navy-700 hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
            {formData.venueRequirements.bookingType.replace(/_/g, " ")}
          </span>
          {formData.venueRequirements.roomSetup && (
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
              {formData.venueRequirements.roomSetup} setup
            </span>
          )}
          {formData.venueRequirements.alcoholServed && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              Alcohol (HPD required)
            </span>
          )}
          {formData.venueRequirements.specialRequirements.map((req) => (
            <span
              key={req}
              className="rounded-full bg-navy-700/10 px-3 py-1 text-xs font-medium text-navy-700"
            >
              {req}
            </span>
          ))}
        </div>
      </div>

      {/* Catering Summary */}
      {(formData.venueRequirements.bookingType === "hall_catering" ||
        formData.venueRequirements.bookingType === "catering_only") &&
        formData.catering.serviceStyle && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-amber-800">Catering Details</h3>
            <span className="text-xs text-amber-600">By Nu&#39;uanu Cookhouse</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              {formData.catering.serviceStyle}
            </span>
            {formData.catering.cuisines.map((c) => (
              <span
                key={c}
                className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
              >
                {c}
              </span>
            ))}
            {formData.catering.dessertNeeded && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                Dessert
              </span>
            )}
            {formData.catering.beverages.map((b) => (
              <span
                key={b}
                className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
              >
                {b.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="rounded-xl border border-stone-200 bg-white">
        <div className="border-b border-stone-100 px-4 py-3">
          <h3 className="font-semibold text-stone-800">Cost Breakdown</h3>
        </div>

        <div className="divide-y divide-stone-100">
          {/* Hall Rental */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-stone-800">Hall Rental</p>
              <p className="font-semibold text-stone-900">
                {formatCurrency(quote.hallRentalTotal)}
              </p>
            </div>
            <div className="mt-1 space-y-0.5 text-xs text-stone-500">
              <p>Base rate (4 hours): {formatCurrency(quote.breakdown.hallBaseRate)}</p>
              {quote.breakdown.hallOvertimeHours > 0 && (
                <p>
                  Overtime ({quote.breakdown.hallOvertimeHours} hrs):{" "}
                  {formatCurrency(quote.breakdown.hallOvertimeCost)}
                </p>
              )}
            </div>
          </div>

          {/* Event Support */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-stone-800">Event Support</p>
              <p className="font-semibold text-stone-900">
                {formatCurrency(quote.eventSupportTotal)}
              </p>
            </div>
            <div className="mt-1 space-y-0.5 text-xs text-stone-500">
              <p>{quote.requiredStaff} staff required for your event</p>
              <p>
                Base: {formatCurrency(quote.breakdown.supportBaseRate)}
              </p>
              {quote.breakdown.supportOvertimeHours > 0 && (
                <p>
                  Overtime ({quote.breakdown.supportOvertimeHours} hrs x{" "}
                  {quote.requiredStaff} staff):{" "}
                  {formatCurrency(quote.breakdown.supportOvertimeCost)}
                </p>
              )}
            </div>
          </div>

          {/* Equipment */}
          {formData.equipment.length > 0 && (
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-stone-800">Equipment</p>
                  <button
                    type="button"
                    onClick={() => onGoToStep(4)}
                    className="text-xs font-medium text-navy-700 hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="font-semibold text-stone-900">
                  {formatCurrency(quote.equipmentTotal)}
                </p>
              </div>
              <ul className="mt-1 space-y-0.5 text-xs text-stone-500">
                {formData.equipment.map((item) => (
                  <li key={item.equipmentId} className="flex justify-between">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>
                      {formatCurrency(item.quantity * item.unitRate)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* HPD / Services */}
          {quote.hpdIncluded && (
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-stone-800">
                  HPD Security (Alcohol)
                </p>
                <p className="font-semibold text-stone-900">
                  {formatCurrency(quote.hpdCost)}
                </p>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                $300/hr x {quote.eventDurationHours} hours
              </p>
            </div>
          )}

          {/* Security Deposit */}
          {quote.securityDeposit > 0 && (
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-stone-800">Security Deposit</p>
                <p className="font-semibold text-stone-900">
                  {formatCurrency(quote.securityDeposit)}
                </p>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                Refundable upon satisfactory event completion
              </p>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="border-t-2 border-navy-700 bg-navy-700/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-stone-900">Estimated Total</p>
            <p className="text-2xl font-bold text-navy-700">
              {formatCurrency(quote.grandTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Catering Note */}
      {(formData.venueRequirements.bookingType === "hall_catering" ||
        formData.venueRequirements.bookingType === "catering_only") && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">
            Catering Quote Separate
          </p>
          <p className="mt-1 text-sm text-amber-700">
            Hall rental quote shown above. Catering pricing is separate and
            will be quoted by Nu&#39;uanu Cookhouse after your inquiry is submitted.
          </p>
        </div>
      )}

      {/* Fine Print */}
      <p className="text-center text-xs text-stone-400">
        This is an estimate based on the details you provided. Final pricing
        will be confirmed upon booking review by our events team.
      </p>

      {/* Submit Error */}
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-sm font-medium text-red-800">{submitError}</p>
        </div>
      )}

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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-lg bg-forest-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Submitting...
            </span>
          ) : (
            "Submit Inquiry"
          )}
        </button>
      </div>
    </div>
  );
}
