'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-stone-800">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-stone-500">
        An unexpected error occurred. Please try again or contact support if the
        problem persists.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-navy-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
      >
        Try Again
      </button>
      <p className="mt-4 text-sm text-stone-500">
        Need help? Call us at{' '}
        <a href="tel:808-944-4737" className="text-navy-700 underline">
          808-944-4737
        </a>{' '}
        or{' '}
        <a href="mailto:info@shoboji.org" className="text-navy-700 underline">
          email us
        </a>
        .
      </p>
    </div>
  );
}
