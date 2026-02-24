import { useForm } from "react-hook-form";
import type { BookingFormData, MembershipTierOption } from "./types";

interface ClientInfoFormProps {
  data: BookingFormData["clientInfo"];
  tiers: MembershipTierOption[];
  onNext: (data: BookingFormData["clientInfo"]) => void;
}

export function ClientInfoForm({ data, tiers, onNext }: ClientInfoFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData["clientInfo"]>({
    defaultValues: data,
  });

  const isMember = watch("isMember");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          Tell Us About Yourself
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          We will use this information to contact you about your booking.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-stone-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          {...register("fullName", {
            required: "Full name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
          })}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          placeholder="John Smith"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* Organization */}
      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-stone-700">
          Organization
        </label>
        <input
          id="organization"
          type="text"
          {...register("organization")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          placeholder="Company or organization name (optional)"
        />
      </div>

      {/* Phone & Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-stone-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
            placeholder="(808) 555-0100"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Mailing Address */}
      <div>
        <label htmlFor="mailingAddress" className="block text-sm font-medium text-stone-700">
          Mailing Address
        </label>
        <input
          id="mailingAddress"
          type="text"
          {...register("mailingAddress")}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
          placeholder="Street address, city, state, zip"
        />
      </div>

      {/* Preferred Contact */}
      <fieldset>
        <legend className="text-sm font-medium text-stone-700">
          Preferred Contact Method
        </legend>
        <div className="mt-2 flex gap-6">
          {(["phone", "text", "email"] as const).map((method) => (
            <label key={method} className="flex items-center gap-2">
              <input
                type="radio"
                value={method}
                {...register("preferredContact")}
                className="h-4 w-4 border-stone-300 text-navy-700 focus:ring-navy-600"
              />
              <span className="text-sm capitalize text-stone-700">{method}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Membership Tier */}
      <div>
        <label htmlFor="membershipTierId" className="block text-sm font-medium text-stone-700">
          Membership Tier <span className="text-red-500">*</span>
        </label>
        <select
          id="membershipTierId"
          {...register("membershipTierId", {
            required: "Please select a membership tier",
            valueAsNumber: true,
            validate: (v) => v > 0 || "Please select a membership tier",
          })}
          className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 focus:outline-none"
        >
          <option value={0}>Select your membership tier</option>
          {tiers.map((tier) => (
            <option key={tier.id} value={tier.id}>
              {tier.tierName} (base: ${Number(tier.hallBaseRate).toFixed(0)})
            </option>
          ))}
        </select>
        {errors.membershipTierId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.membershipTierId.message}
          </p>
        )}
      </div>

      {/* Is Member */}
      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            {...register("isMember")}
            className="mt-0.5 h-4 w-4 rounded border-stone-300 text-navy-700 focus:ring-navy-600"
          />
          <div>
            <span className="text-sm font-medium text-stone-700">
              I am a current Shoboji Temple member
            </span>
            {!isMember && (
              <p className="mt-1 text-xs text-stone-500">
                Not a member? Save on your bookings with our $150/year temple
                membership. Ask us about becoming a member.
              </p>
            )}
          </div>
        </label>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="rounded-lg bg-navy-700 px-8 py-3 font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Next: Event Details
        </button>
      </div>
    </form>
  );
}
