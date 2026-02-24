import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Booking Submitted | Shoboji Social Hall",
  description: "Your booking inquiry has been submitted successfully.",
};

interface ConfirmationPageProps {
  searchParams: Promise<{ booking?: string }>;
}

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const params = await searchParams;
  const bookingNumber = params.booking;

  if (!bookingNumber) {
    redirect("/book");
  }

  const steps = [
    {
      number: 1,
      title: "We Review Your Inquiry",
      description:
        "Our events team will review your submission and confirm availability, pricing, and any special requirements.",
    },
    {
      number: 2,
      title: "Receive Your Official Quote",
      description:
        "We will send you a detailed quote via your preferred contact method, typically within 1-2 business days.",
    },
    {
      number: 3,
      title: "Confirm with Deposit",
      description:
        "Once you approve the quote, submit your security deposit to lock in your date. Your booking is then confirmed.",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      {/* Success Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-500/10">
        <svg
          className="h-8 w-8 text-forest-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="mt-6 text-3xl font-bold text-stone-900">
        Inquiry Submitted
      </h1>
      <p className="mt-3 text-lg text-stone-600">
        Thank you for choosing Shoboji Social Hall for your event.
      </p>

      {/* Booking Number */}
      <div className="mx-auto mt-8 inline-block rounded-xl border border-stone-200 bg-white px-8 py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
          Booking Reference
        </p>
        <p className="mt-1 text-2xl font-bold tracking-wide text-navy-700">
          {bookingNumber}
        </p>
        <p className="mt-1 text-xs text-stone-400">
          Please save this number for your records.
        </p>
      </div>

      {/* What Happens Next */}
      <div className="mt-12 text-left">
        <h2 className="text-center text-xl font-semibold text-stone-900">
          What Happens Next
        </h2>
        <ol className="mt-6 space-y-6">
          {steps.map((step) => (
            <li key={step.number} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-700 text-sm font-bold text-white">
                {step.number}
              </span>
              <div>
                <p className="font-semibold text-stone-800">{step.title}</p>
                <p className="mt-1 text-sm text-stone-600">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-lg bg-navy-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Return to Home
        </Link>
        <Link
          href="/book"
          className="rounded-lg border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
        >
          Submit Another Inquiry
        </Link>
      </div>
    </div>
  );
}
