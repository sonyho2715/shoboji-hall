export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        {/* Hero skeleton */}
        <div className="h-8 w-64 rounded bg-stone-200" />
        <div className="h-4 w-96 rounded bg-stone-200" />

        {/* Content skeleton */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-stone-200 bg-white p-6">
              <div className="h-4 w-24 rounded bg-stone-200" />
              <div className="mt-4 h-8 w-20 rounded bg-stone-200" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-stone-100" />
                <div className="h-3 w-3/4 rounded bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
