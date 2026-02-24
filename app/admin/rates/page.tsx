import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { RatesTabs } from '@/components/admin/rates/RatesTabs';
import { MembershipTierEditor } from '@/components/admin/rates/MembershipTierEditor';
import { FuneralPackageEditor } from '@/components/admin/rates/FuneralPackageEditor';
import { ServiceRatesEditor } from '@/components/admin/rates/ServiceRatesEditor';

export default async function RatesPage() {
  const session = await requireAdmin();

  const [tiers, serviceRates, funeralTiers] = await Promise.all([
    db.membershipTier.findMany({ orderBy: { id: 'asc' } }),
    db.serviceRate.findMany({ orderBy: { id: 'asc' } }),
    db.funeralPackageTier.findMany({ orderBy: { id: 'asc' } }),
  ]);

  // Serialize Decimal fields to plain number strings for client components
  const serializedTiers = tiers.map((t) => ({
    id: t.id,
    tierName: t.tierName,
    description: t.description,
    hallBaseRate: String(t.hallBaseRate),
    hallHourlyRate: String(t.hallHourlyRate),
    eventSupportBase: String(t.eventSupportBase),
    eventSupportHourly: String(t.eventSupportHourly),
    securityDeposit: String(t.securityDeposit),
    isActive: t.isActive,
  }));

  const serializedFuneralTiers = funeralTiers.map((ft) => ({
    id: ft.id,
    tierName: ft.tierName,
    attendeeRange: ft.attendeeRange,
    minAttendees: ft.minAttendees,
    maxAttendees: ft.maxAttendees,
    rate: String(ft.rate),
    securityDeposit: String(ft.securityDeposit),
    isActive: ft.isActive,
  }));

  const serializedServices = serviceRates.map((sr) => ({
    id: sr.id,
    roleName: sr.roleName,
    ratePerHour: sr.ratePerHour ? String(sr.ratePerHour) : null,
    rateType: sr.rateType,
    commissionPct: sr.commissionPct ? String(sr.commissionPct) : null,
    minHours: sr.minHours,
    notes: sr.notes,
    isActive: sr.isActive,
  }));

  const tabs = [
    {
      id: 'membership',
      label: 'Membership Tiers',
      content: <MembershipTierEditor tiers={serializedTiers} />,
    },
    {
      id: 'funeral',
      label: 'Funeral Package Rates',
      content: <FuneralPackageEditor tiers={serializedFuneralTiers} />,
    },
    {
      id: 'services',
      label: 'Service Personnel Rates',
      content: <ServiceRatesEditor services={serializedServices} />,
    },
  ];

  return (
    <>
      <AdminHeader title="Rate Management" adminName={session.name} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <RatesTabs tabs={tabs} />
        </div>
      </div>
    </>
  );
}
