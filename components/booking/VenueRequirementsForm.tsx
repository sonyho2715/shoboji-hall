import { useForm, useWatch } from "react-hook-form";
import type { BookingFormData } from "./types";

interface VenueRequirementsFormProps {
  data: BookingFormData["venueRequirements"];
  onNext: (data: BookingFormData["venueRequirements"]) => void;
  onBack: () => void;
}

const bookingTypes = [
  {
    value: "hall_catering",
    label: "Hall + Catering",
    description: "Hall rental with in-house catering by Nu'uanu Cookhouse",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
      </svg>
    ),
  },
  {
    value: "hall_rental",
    label: "Hall Rental",
    description: "Rent the hall for your own event with full flexibility",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
      </svg>
    ),
  },
  {
    value: "catering_only",
    label: "Catering Only",
    description: "Catering by Nu'uanu Cookhouse without hall rental",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
  {
    value: "funeral_package",
    label: "After-Funeral Package",
    description: "All-inclusive flat-rate package for memorial receptions",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

const roomSetups = [
  { value: "banquet", label: "Banquet", description: "Round tables for seated dining" },
  { value: "classroom", label: "Classroom", description: "Rows of tables facing forward" },
  { value: "theater", label: "Theater", description: "Rows of chairs, no tables" },
  { value: "cocktail", label: "Cocktail", description: "High-tops and open standing room" },
  { value: "custom", label: "Custom", description: "Tell us your layout needs" },
];

const specialRequirementOptions = [
  "Stage",
  "Podium",
  "Dance Floor",
  "DJ / Band Area",
  "AV Equipment",
  "Projector / Screen",
  "Security",
  "Decorations Allowed",
];

const budgetOptions = [
  { value: "under_2500", label: "Under $2,500" },
  { value: "2500_5000", label: "$2,500 -- $5,000" },
  { value: "5000_10000", label: "$5,000 -- $10,000" },
  { value: "10000_plus", label: "$10,000+" },
];

export function VenueRequirementsForm({
  data,
  onNext,
  onBack,
}: VenueRequirementsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData["venueRequirements"]>({
    defaultValues: data,
  });

  const bookingType = useWatch({ control, name: "bookingType" });
  const alcoholServed = useWatch({ control, name: "alcoholServed" });
  const roomSetup = useWatch({ control, name: "roomSetup" });
  const budgetRange = useWatch({ control, name: "budgetRange" });
  const readyToReserve = useWatch({ control, name: "readyToReserve" });

  const hasCatering = bookingType === "hall_catering" || bookingType === "catering_only";

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          Venue & Budget
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Configure your event space, special needs, and budget range.
        </p>
      </div>

      {/* Booking Type */}
      <fieldset>
        <legend className="text-sm font-medium text-stone-700">
          Booking Type <span className="text-red-500">*</span>
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {bookingTypes.map((bt) => {
            const isSelected = bookingType === bt.value;
            return (
              <label
                key={bt.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                  isSelected
                    ? "border-navy-700 bg-navy-700/5"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  value={bt.value}
                  {...register("bookingType", { required: "Please select a booking type" })}
                  className="sr-only"
                />
                <div className={`mt-0.5 ${isSelected ? "text-navy-700" : "text-stone-400"}`}>
                  {bt.icon}
                </div>
                <div>
                  <p className={`font-semibold ${isSelected ? "text-navy-700" : "text-stone-800"}`}>
                    {bt.label}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">{bt.description}</p>
                </div>
              </label>
            );
          })}
        </div>
        {errors.bookingType && (
          <p className="mt-2 text-sm text-red-600">{errors.bookingType.message}</p>
        )}
      </fieldset>

      {/* Funeral Package Info */}
      {bookingType === "funeral_package" && (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <h4 className="font-semibold text-stone-800">
            After-Funeral Package
          </h4>
          <p className="mt-1 text-sm text-stone-600">
            Our after-funeral reception package includes hall rental, basic
            table and chair setup, kitchen access, and event support staff. The
            flat rate is based on your membership tier and expected attendance.
            No overtime charges apply for standard 4-hour receptions.
          </p>
        </div>
      )}

      {/* Catering info */}
      {hasCatering && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h4 className="font-semibold text-amber-800">
            In-House Catering by Nu&#39;uanu Cookhouse
          </h4>
          <p className="mt-1 text-sm text-amber-700">
            You&#39;ll provide catering preferences in the next step. Nu&#39;uanu Cookhouse will
            follow up with a separate catering quote after your inquiry is submitted.
          </p>
        </div>
      )}

      {/* Room Setup */}
      <fieldset>
        <legend className="text-sm font-medium text-stone-700">
          Room Setup
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {roomSetups.map((setup) => {
            const isSelected = roomSetup === setup.value;
            return (
              <label
                key={setup.value}
                className={`flex cursor-pointer flex-col items-center rounded-xl border-2 px-3 py-4 text-center transition-colors ${
                  isSelected
                    ? "border-navy-700 bg-navy-700/5"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  value={setup.value}
                  {...register("roomSetup")}
                  className="sr-only"
                />
                <p className={`text-sm font-semibold ${isSelected ? "text-navy-700" : "text-stone-700"}`}>
                  {setup.label}
                </p>
                <p className="mt-1 text-xs text-stone-500">{setup.description}</p>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Alcohol */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-stone-700">
              Will alcohol be served?
            </p>
            <p className="text-xs text-stone-500">
              Alcohol events require an HPD security officer on-site.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={alcoholServed}
            onClick={() => {
              setValue("alcoholServed", !alcoholServed);
              if (alcoholServed) {
                setValue("barType", "");
              }
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              alcoholServed ? "bg-navy-700" : "bg-stone-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                alcoholServed ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {alcoholServed && (
          <>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">
                HPD Security Required
              </p>
              <p className="mt-1 text-xs text-amber-700">
                A Honolulu Police Department security officer is required for
                all events serving alcohol, at $300/hour for the duration of
                your event. This will be automatically included in your quote.
              </p>
            </div>
            <fieldset>
              <legend className="text-sm font-medium text-stone-700">
                Bar Type
              </legend>
              <div className="mt-2 flex gap-4">
                {[
                  { value: "hosted", label: "Hosted Bar (host pays)" },
                  { value: "cash", label: "Cash Bar (guests pay)" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={opt.value}
                      {...register("barType")}
                      className="h-4 w-4 border-stone-300 text-navy-700 focus:ring-navy-600"
                    />
                    <span className="text-sm text-stone-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}
      </div>

      {/* Special Requirements */}
      <fieldset>
        <legend className="text-sm font-medium text-stone-700">
          Special Requirements
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {specialRequirementOptions.map((req) => (
            <label
              key={req}
              className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2.5 transition-colors hover:bg-stone-50"
            >
              <input
                type="checkbox"
                value={req}
                {...register("specialRequirements")}
                className="h-4 w-4 rounded border-stone-300 text-navy-700 focus:ring-navy-600"
              />
              <span className="text-sm text-stone-700">{req}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Additional Notes */}
      <div>
        <label htmlFor="additionalNotes" className="block text-sm font-medium text-stone-700">
          Additional Notes
        </label>
        <textarea
          id="additionalNotes"
          rows={3}
          {...register("additionalNotes")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          placeholder="Any other requirements or questions for our team"
        />
      </div>

      {/* Budget Range */}
      <fieldset>
        <legend className="text-sm font-medium text-stone-700">
          Estimated Budget Range
        </legend>
        <p className="mt-0.5 text-xs text-stone-500">
          Helps us tailor the best options for your event.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {budgetOptions.map((opt) => {
            const isSelected = budgetRange === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3 text-center transition-colors ${
                  isSelected
                    ? "border-navy-700 bg-navy-700/5"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register("budgetRange")}
                  className="sr-only"
                />
                <span className={`text-sm font-semibold ${isSelected ? "text-navy-700" : "text-stone-700"}`}>
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Ready to Reserve */}
      <fieldset>
        <legend className="text-sm font-medium text-stone-700">
          Are you ready to reserve your date?
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
              readyToReserve === true
                ? "border-forest-600 bg-forest-600/5"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <input
              type="radio"
              value="true"
              checked={readyToReserve === true}
              onChange={() => setValue("readyToReserve", true)}
              className="sr-only"
            />
            <div className={`mt-0.5 ${readyToReserve === true ? "text-forest-600" : "text-stone-400"}`}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${readyToReserve === true ? "text-forest-600" : "text-stone-800"}`}>
                Yes, I&#39;m ready to reserve
              </p>
              <p className="mt-0.5 text-xs text-stone-500">I want to lock in my date</p>
            </div>
          </label>
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
              readyToReserve === false
                ? "border-navy-700 bg-navy-700/5"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <input
              type="radio"
              value="false"
              checked={readyToReserve === false}
              onChange={() => setValue("readyToReserve", false)}
              className="sr-only"
            />
            <div className={`mt-0.5 ${readyToReserve === false ? "text-navy-700" : "text-stone-400"}`}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${readyToReserve === false ? "text-navy-700" : "text-stone-800"}`}>
                Just gathering information
              </p>
              <p className="mt-0.5 text-xs text-stone-500">Still exploring options</p>
            </div>
          </label>
        </div>
      </fieldset>

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
          {hasCatering ? "Next: Catering" : "Next: Equipment"}
        </button>
      </div>
    </form>
  );
}
