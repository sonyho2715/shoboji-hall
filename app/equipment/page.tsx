import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Equipment Catalog | Shoboji Social Hall",
  description:
    "Browse our full catalog of event equipment including tables, chairs, AV gear, lighting, and more.",
};

export default async function EquipmentPage() {
  const categories = await db.equipmentCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          Equipment Catalog
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-stone-600">
          We maintain a full inventory of event equipment available for your
          rental. All rates shown are per event.
        </p>
      </div>

      {/* Categories */}
      <div className="mt-12 space-y-12">
        {categories.map((cat) => (
          <section key={cat.id}>
            <h2 className="text-xl font-bold text-stone-900">{cat.name}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col rounded-xl border border-stone-200 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-800">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-stone-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-navy-700">
                        ${Number(item.ratePerEvent).toFixed(0)}
                      </p>
                      <p className="text-xs text-stone-400">per event</p>
                    </div>
                    <p className="text-xs text-stone-400">
                      {item.quantityAvailable} available
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-xl bg-navy-700/5 p-8 text-center">
        <h3 className="text-xl font-bold text-stone-900">
          Need Equipment for Your Event?
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-stone-600">
          Select the equipment you need in Step 4 of our booking wizard. You
          can mix and match from any category to build the perfect setup.
        </p>
        <Link
          href="/book"
          className="mt-6 inline-block rounded-lg bg-navy-700 px-8 py-3 font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Start Booking
        </Link>
      </div>
    </div>
  );
}
