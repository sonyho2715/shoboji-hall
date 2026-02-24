"use client";

import { useForm, useWatch } from "react-hook-form";
import type { BookingFormData } from "./types";

interface CateringDetailsFormProps {
  data: BookingFormData["catering"];
  onNext: (data: BookingFormData["catering"]) => void;
  onBack: () => void;
}

const serviceStyles = [
  {
    value: "buffet",
    label: "Buffet",
    description: "Full spread, self-serve stations",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    ),
  },
  {
    value: "bento",
    label: "Bento",
    description: "Individual plated portions",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    value: "dropoff",
    label: "Drop-Off / Delivery Only",
    description: "Food delivered, no service staff",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

const cuisineOptions = [
  { value: "local", label: "Local Plate Lunch" },
  { value: "hawaiian", label: "Hawaiian" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "american", label: "American Comfort" },
  { value: "fusion", label: "Fusion" },
  { value: "other", label: "Other" },
];

const beverageOptions = [
  { value: "water_tea", label: "Water & Iced Tea" },
  { value: "soft_drinks", label: "Soft Drinks" },
  { value: "coffee_tea", label: "Coffee / Tea" },
  { value: "full_service", label: "Full Beverage Service" },
];

export function CateringDetailsForm({
  data,
  onNext,
  onBack,
}: CateringDetailsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
  } = useForm<BookingFormData["catering"]>({
    defaultValues: data,
  });

  const serviceStyle = useWatch({ control, name: "serviceStyle" });
  const cuisines = useWatch({ control, name: "cuisines" });
  const dessertNeeded = useWatch({ control, name: "dessertNeeded" });
  const hasOther = cuisines?.includes("other") ?? false;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label="catering">&#127869;</span>
          <div>
            <h2 className="text-2xl font-bold text-stone-900">
              Catering by Nu&#39;uanu Cookhouse
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              In-house catering available through our partner Nu&#39;uanu Cookhouse,
              serving authentic local Hawaiian cuisine for events of all sizes.
            </p>
          </div>
        </div>
      </div>

      {/* Preferred Service Style */}
      <fieldset>
        <legend className="text-sm font-medium text-stone-700">
          Preferred Service Style
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {serviceStyles.map((style) => {
            const isSelected = serviceStyle === style.value;
            return (
              <label
                key={style.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                  isSelected
                    ? "border-amber-600 bg-amber-50"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  value={style.value}
                  {...register("serviceStyle")}
                  className="sr-only"
                />
                <div className={`mt-0.5 ${isSelected ? "text-amber-600" : "text-stone-400"}`}>
                  {style.icon}
                </div>
                <div>
                  <p className={`font-semibold ${isSelected ? "text-amber-700" : "text-stone-800"}`}>
                    {style.label}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">{style.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Cuisine Preference */}
      <fieldset>
        <legend className="text-sm font-medium text-stone-700">
          Cuisine Preference
        </legend>
        <p className="mt-0.5 text-xs text-stone-500">Select all that apply</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {cuisineOptions.map((cuisine) => (
            <label
              key={cuisine.value}
              className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2.5 transition-colors hover:bg-stone-50"
            >
              <input
                type="checkbox"
                value={cuisine.value}
                {...register("cuisines")}
                className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-stone-700">{cuisine.label}</span>
            </label>
          ))}
        </div>
        {hasOther && (
          <div className="mt-3">
            <label htmlFor="cuisineOther" className="block text-sm font-medium text-stone-700">
              Other Cuisine (please specify)
            </label>
            <input
              id="cuisineOther"
              type="text"
              {...register("cuisineOther")}
              className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
              placeholder="e.g., Filipino, Thai, Mediterranean"
            />
          </div>
        )}
      </fieldset>

      {/* Dietary Restrictions */}
      <div>
        <label htmlFor="dietary" className="block text-sm font-medium text-stone-700">
          Dietary Restrictions / Allergies
        </label>
        <textarea
          id="dietary"
          rows={2}
          {...register("dietary")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          placeholder="e.g., No shellfish, nut-free options needed, vegetarian"
        />
      </div>

      {/* Menu Notes */}
      <div>
        <label htmlFor="menuNotes" className="block text-sm font-medium text-stone-700">
          Sample Menu Ideas or Specific Requests
        </label>
        <textarea
          id="menuNotes"
          rows={3}
          {...register("menuNotes")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          placeholder="e.g., Family style preferred, want kalua pig, lomi salmon, chicken katsu"
        />
      </div>

      {/* Dessert Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-700">
            Dessert Needed?
          </p>
          <p className="text-xs text-stone-500">
            Include dessert options in the catering quote
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={dessertNeeded}
          onClick={() => setValue("dessertNeeded", !dessertNeeded)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            dessertNeeded ? "bg-amber-600" : "bg-stone-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              dessertNeeded ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Beverage Service */}
      <fieldset>
        <legend className="text-sm font-medium text-stone-700">
          Beverage Service
        </legend>
        <p className="mt-0.5 text-xs text-stone-500">Select all that apply</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {beverageOptions.map((bev) => (
            <label
              key={bev.value}
              className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2.5 transition-colors hover:bg-stone-50"
            >
              <input
                type="checkbox"
                value={bev.value}
                {...register("beverages")}
                className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-stone-700">{bev.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Note */}
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm text-stone-600">
          Catering details will be forwarded to Nu&#39;uanu Cookhouse who will follow up
          with a separate catering quote.
        </p>
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
          Next: Equipment
        </button>
      </div>
    </form>
  );
}
