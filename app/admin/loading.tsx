export default function AdminLoading() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-56 rounded bg-gray-100" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="h-3 w-24 rounded bg-gray-200" />
              <div className="mt-3 h-7 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="h-5 w-32 rounded bg-gray-200" />
          </div>
          <div className="divide-y divide-gray-50 px-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <div className="h-4 w-24 rounded bg-gray-100" />
                <div className="h-4 w-40 rounded bg-gray-100" />
                <div className="h-4 w-16 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
