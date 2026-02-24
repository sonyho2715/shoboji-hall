import type { Metadata } from "next";
import { db } from "@/lib/db";
import { BookingWizard } from "@/components/booking/BookingWizard";
import type { PackagePreFill } from "@/components/booking/BookingWizard";
import type {
  MembershipTierOption,
  EquipmentCategoryOption,
} from "@/components/booking/types";
import { getPackageById } from "@/lib/packages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book Your Event | Shoboji Social Hall",
  description:
    "Book the Shoboji Social Hall for your next event. Get an instant quote with our step-by-step booking wizard.",
};

interface BookPageProps {
  searchParams: Promise<{
    package?: string;
    guests?: string;
  }>;
}

async function getMembershipTiers(): Promise<MembershipTierOption[]> {
  const tiers = await db.membershipTier.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  return tiers.map((t) => ({
    id: t.id,
    tierName: t.tierName,
    description: t.description,
    hallBaseRate: String(t.hallBaseRate),
    hallHourlyRate: String(t.hallHourlyRate),
    eventSupportBase: String(t.eventSupportBase),
    eventSupportHourly: String(t.eventSupportHourly),
    securityDeposit: String(t.securityDeposit),
  }));
}

async function getEquipmentCategories(): Promise<EquipmentCategoryOption[]> {
  const categories = await db.equipmentCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    sortOrder: c.sortOrder,
    items: c.items.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      ratePerEvent: String(i.ratePerEvent),
      quantityAvailable: i.quantityAvailable,
    })),
  }));
}

/**
 * Match package equipment names to actual DB equipment items.
 * Uses case-insensitive partial matching for resilience.
 */
function buildPackagePreFill(
  packageId: string,
  guestCount: number,
  equipmentCategories: EquipmentCategoryOption[]
): PackagePreFill | undefined {
  const pkg = getPackageById(packageId);
  if (!pkg) return undefined;

  // Flatten all equipment items from all categories
  const allItems = equipmentCategories.flatMap((c) => c.items);

  // Match package equipment names to DB items
  const matchedEquipment: PackagePreFill["matchedEquipment"] = [];
  for (const pkgItem of pkg.includedEquipment) {
    const dbItem = allItems.find(
      (item) => item.name.toLowerCase() === pkgItem.name.toLowerCase()
    );
    if (dbItem) {
      // Clamp quantity to available
      const quantity = Math.min(pkgItem.quantity, dbItem.quantityAvailable);
      matchedEquipment.push({
        equipmentId: dbItem.id,
        quantity,
        unitRate: Number(dbItem.ratePerEvent),
        name: dbItem.name,
      });
    }
  }

  return {
    package: pkg,
    guestCount,
    matchedEquipment,
  };
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams;
  const [tiers, equipmentCategories] = await Promise.all([
    getMembershipTiers(),
    getEquipmentCategories(),
  ]);

  // Build package pre-fill if URL params are present
  let packagePreFill: PackagePreFill | undefined;
  if (params.package) {
    const guestCount = params.guests ? Number(params.guests) : 100;
    packagePreFill = buildPackagePreFill(
      params.package,
      guestCount,
      equipmentCategories
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-stone-900">
          Book Your Event
        </h1>
        <p className="mt-2 text-stone-600">
          Complete the form below to receive an instant quote. Our team will
          review your inquiry and follow up within 1-2 business days.
        </p>
      </div>

      <BookingWizard
        tiers={tiers}
        equipmentCategories={equipmentCategories}
        packagePreFill={packagePreFill}
      />
    </div>
  );
}
