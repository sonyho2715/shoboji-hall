import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-stone-300">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-stone-800">
        Page Not Found
      </h2>
      <p className="mt-2 text-stone-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-navy-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Back to Home
        </Link>
        <Link
          href="/book"
          className="rounded-lg border border-stone-300 px-6 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
        >
          Book an Event
        </Link>
      </div>
    </div>
  );
}
