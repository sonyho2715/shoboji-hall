import { useForm, useWatch } from "react-hook-form";
import type { BookingFormData } from "./types";

interface EventDetailsFormProps {
  data: BookingFormData["eventDetails"];
  onNext: (data: BookingFormData["eventDetails"]) => void;
  onBack: () => void;
}

const timeOptions: string[] = [];
for (let h = 8; h <= 22; h++) {
  timeOptions.push(`${String(h).padStart(2, "0")}:00`);
  if (h < 22) {
    timeOptions.push(`${String(h).padStart(2, "0")}:30`);
  }
}

function formatTime(t: string): string {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr;
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m} ${suffix}`;
}

function calcDuration(start: string, end: string): number | null {
  if (!start || !end) return null;
  const [sH, sM] = start.split(":").map(Number);
  const [eH, eM] = end.split(":").map(Number);
  const diff = eH * 60 + eM - (sH * 60 + sM);
  if (diff <= 0) return null;
  return diff / 60;
}

const setupOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4];
const breakdownOptions = [0, 0.5, 1, 1.5, 2];

const referralOptions = [
  { value: "", label: "Select one" },
  { value: "social_media", label: "Social Media" },
  { value: "website", label: "Website Search" },
  { value: "referral", label: "Friend / Family Referral" },
  { value: "walk_in", label: "Walk-in / Drive-by" },
  { value: "other", label: "Other" },
];

const today = new Date().toISOString().split("T")[0];

export function EventDetailsForm({
  data,
  onNext,
  onBack,
}: EventDetailsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingFormData["eventDetails"]>({
    defaultValues: data,
  });

  const startTime = useWatch({ control, name: "eventStartTime" });
  const endTime = useWatch({ control, name: "eventEndTime" });
  const adults = useWatch({ control, name: "adultCount" });
  const children = useWatch({ control, name: "childCount" });

  const duration = calcDuration(startTime, endTime);
  const totalGuests = (Number(adults) || 0) + (Number(children) || 0);

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">Event Details</h2>
        <p className="mt-1 text-sm text-stone-500">
          Tell us about your event so we can prepare the best experience.
        </p>
      </div>

      {/* Event Type & Description */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-stone-700">
            Event Type <span className="text-red-500">*</span>
          </label>
          <input
            id="eventType"
            type="text"
            {...register("eventType", {
              required: "Event type is required",
              minLength: { value: 2, message: "Please describe your event type" },
            })}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
            placeholder="Wedding, Birthday, Corporate, etc."
          />
          {errors.eventType && (
            <p className="mt-1 text-sm text-red-600">{errors.eventType.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-stone-700">
            Event Date <span className="text-red-500">*</span>
          </label>
          <input
            id="eventDate"
            type="date"
            min={today}
            {...register("eventDate", { required: "Event date is required" })}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          />
          {errors.eventDate && (
            <p className="mt-1 text-sm text-red-600">{errors.eventDate.message}</p>
          )}
        </div>
      </div>

      {/* Event Description */}
      <div>
        <label htmlFor="eventDescription" className="block text-sm font-medium text-stone-700">
          Event Description
        </label>
        <textarea
          id="eventDescription"
          rows={3}
          {...register("eventDescription")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          placeholder="Brief description of your event, theme, or any special details"
        />
      </div>

      {/* Start Time / End Time */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="eventStartTime" className="block text-sm font-medium text-stone-700">
            Start Time <span className="text-red-500">*</span>
          </label>
          <select
            id="eventStartTime"
            {...register("eventStartTime", { required: "Start time is required" })}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          >
            <option value="">Select start time</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {formatTime(t)}
              </option>
            ))}
          </select>
          {errors.eventStartTime && (
            <p className="mt-1 text-sm text-red-600">{errors.eventStartTime.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="eventEndTime" className="block text-sm font-medium text-stone-700">
            End Time <span className="text-red-500">*</span>
          </label>
          <select
            id="eventEndTime"
            {...register("eventEndTime", {
              required: "End time is required",
              validate: (val) => {
                if (!startTime || !val) return true;
                return (
                  calcDuration(startTime, val) !== null ||
                  "End time must be after start time"
                );
              },
            })}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          >
            <option value="">Select end time</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {formatTime(t)}
              </option>
            ))}
          </select>
          {errors.eventEndTime && (
            <p className="mt-1 text-sm text-red-600">{errors.eventEndTime.message}</p>
          )}
        </div>
      </div>

      {/* Duration Display */}
      {duration !== null && (
        <div className="rounded-lg bg-navy-700/5 px-4 py-3">
          <p className="text-sm font-medium text-navy-700">
            Event duration: {duration} hour{duration !== 1 ? "s" : ""}
            {duration > 4 && (
              <span className="ml-2 text-xs font-normal text-stone-500">
                (4 hours included in base rate, {duration - 4} overtime)
              </span>
            )}
          </p>
        </div>
      )}

      {/* Setup / Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="setupHours" className="block text-sm font-medium text-stone-700">
            Setup Time
          </label>
          <select
            id="setupHours"
            {...register("setupHours", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          >
            {setupOptions.map((h) => (
              <option key={h} value={h}>
                {h === 0 ? "No setup time needed" : `${h} hour${h !== 1 ? "s" : ""}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="breakdownHours" className="block text-sm font-medium text-stone-700">
            Breakdown Time
          </label>
          <select
            id="breakdownHours"
            {...register("breakdownHours", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          >
            {breakdownOptions.map((h) => (
              <option key={h} value={h}>
                {h === 0 ? "No breakdown time needed" : `${h} hour${h !== 1 ? "s" : ""}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Guests */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="adultCount" className="block text-sm font-medium text-stone-700">
            Adults <span className="text-red-500">*</span>
          </label>
          <input
            id="adultCount"
            type="number"
            min={0}
            {...register("adultCount", {
              valueAsNumber: true,
              required: "Adult count is required",
              min: { value: 0, message: "Cannot be negative" },
            })}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          />
          {errors.adultCount && (
            <p className="mt-1 text-sm text-red-600">{errors.adultCount.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="childCount" className="block text-sm font-medium text-stone-700">
            Children
          </label>
          <input
            id="childCount"
            type="number"
            min={0}
            {...register("childCount", {
              valueAsNumber: true,
              min: { value: 0, message: "Cannot be negative" },
            })}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          />
        </div>
        <div className="flex flex-col justify-end">
          <div className="rounded-lg bg-stone-100 px-4 py-2.5 text-center">
            <p className="text-xs text-stone-500">Total Guests</p>
            <p className="text-xl font-bold text-stone-800">{totalGuests}</p>
          </div>
        </div>
      </div>

      {/* Expected Vehicles */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="expectedVehicles" className="block text-sm font-medium text-stone-700">
            Expected Vehicles
          </label>
          <input
            id="expectedVehicles"
            type="number"
            min={0}
            {...register("expectedVehicles", {
              valueAsNumber: true,
              min: { value: 0, message: "Cannot be negative" },
            })}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="referralSource" className="block text-sm font-medium text-stone-700">
            How did you hear about us?
          </label>
          <select
            id="referralSource"
            {...register("referralSource")}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          >
            {referralOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
          type="submit"
          className="rounded-lg bg-navy-700 px-8 py-3 font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Next: Venue Requirements
        </button>
      </div>
    </form>
  );
}
