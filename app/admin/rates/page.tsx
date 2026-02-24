import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';

function formatCurrency(value: number | { toString(): string }): string {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function RatesPage() {
  const session = await requireAdmin();

  const [tiers, serviceRates, funeralTiers] = await Promise.all([
    db.membershipTier.findMany({ orderBy: { id: 'asc' } }),
    db.serviceRate.findMany({ orderBy: { id: 'asc' } }),
    db.funeralPackageTier.findMany({ orderBy: { id: 'asc' } }),
  ]);

  return (
    <>
      <AdminHeader title="Rates" adminName={session.name} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Membership Tiers */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="font-semibold text-gray-900">
                Membership Tier Rates
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Tier
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                      Hall Base
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                      Hall/hr OT
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                      Support Base
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                      Support/hr OT
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                      Deposit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tiers.map((tier) => (
                    <tr key={tier.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                        {tier.tierName}
                        <p className="text-xs font-normal text-gray-400">
                          {tier.description}
                        </p>
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {formatCurrency(tier.hallBaseRate)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {formatCurrency(tier.hallHourlyRate)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {formatCurrency(tier.eventSupportBase)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {formatCurrency(tier.eventSupportHourly)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {formatCurrency(tier.securityDeposit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Service Rates */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="font-semibold text-gray-900">Service Rates</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Role
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                      Rate
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">
                      Min Hours
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {serviceRates.map((svc) => (
                    <tr key={svc.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                        {svc.roleName}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {svc.rateType === 'commission'
                          ? `${Number(svc.commissionPct)}%`
                          : svc.ratePerHour
                            ? `${formatCurrency(svc.ratePerHour)}/hr`
                            : 'Included'}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
                          {svc.rateType}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center text-sm text-gray-700">
                        {svc.minHours > 0 ? svc.minHours : '--'}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">
                        {svc.notes || '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Funeral Package Tiers */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="font-semibold text-gray-900">
                Funeral Package Rates
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Tier
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Attendee Range
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                      Rate
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                      Deposit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {funeralTiers.map((ft) => (
                    <tr key={ft.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                        {ft.tierName}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">
                        {ft.minAttendees}--{ft.maxAttendees} guests
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {formatCurrency(ft.rate)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {formatCurrency(ft.securityDeposit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
