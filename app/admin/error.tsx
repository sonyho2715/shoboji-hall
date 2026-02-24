'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
        <svg
          className="h-7 w-7 text-red-600"
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
      <h2 className="mt-4 text-xl font-semibold text-gray-800">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-center text-sm text-gray-500">
        An error occurred while loading this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-slate-800 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-900"
      >
        Try Again
      </button>
    </div>
  );
}
