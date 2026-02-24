import type { Metadata } from "next";
import { db } from "@/lib/db";
import { BookingWizard } from "@/components/booking/BookingWizard";
import type {
  MembershipTierOption,
  EquipmentCategoryOption,
} from "@/components/booking/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book Your Event | Shoboji Social Hall",
  description:
    "Book the Shoboji Social Hall for your next event. Get an instant quote with our step-by-step booking wizard.",
};

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

export default async function BookPage() {
  const [tiers, equipmentCategories] = await Promise.all([
    getMembershipTiers(),
    getEquipmentCategories(),
  ]);

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
      />
    </div>
  );
}
