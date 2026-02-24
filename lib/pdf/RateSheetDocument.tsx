import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer';

// ---- Colors ----
const NAVY = '#1e3a5f';
const STONE = '#78716c';
const WARM_WHITE = '#faf9f7';
const DARK_TEXT = '#1c1917';
const BORDER = '#d6d3d1';

const s = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: DARK_TEXT,
    backgroundColor: '#ffffff',
  },
  header: {
    textAlign: 'center',
    marginBottom: 24,
  },
  orgName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: STONE,
    marginBottom: 4,
  },
  address: {
    fontSize: 8,
    color: STONE,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionNote: {
    fontSize: 8,
    color: STONE,
    marginBottom: 8,
  },

  // Table styles
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: NAVY,
    padding: 5,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    backgroundColor: WARM_WHITE,
  },
  cell: {
    fontSize: 8,
    color: DARK_TEXT,
  },
  cellRight: {
    fontSize: 8,
    color: DARK_TEXT,
    textAlign: 'right',
  },
  cellBold: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: DARK_TEXT,
  },

  // Membership tier columns
  tierCol1: { width: '20%' },
  tierCol2: { width: '16%', textAlign: 'right' as const },
  tierCol3: { width: '16%', textAlign: 'right' as const },
  tierCol4: { width: '16%', textAlign: 'right' as const },
  tierCol5: { width: '16%', textAlign: 'right' as const },
  tierCol6: { width: '16%', textAlign: 'right' as const },

  // Funeral columns
  funCol1: { width: '25%' },
  funCol2: { width: '25%' },
  funCol3: { width: '25%', textAlign: 'right' as const },
  funCol4: { width: '25%', textAlign: 'right' as const },

  // Equipment columns
  eqCol1: { width: '50%' },
  eqCol2: { width: '25%' },
  eqCol3: { width: '25%', textAlign: 'right' as const },

  // Service columns
  svcCol1: { width: '30%' },
  svcCol2: { width: '20%', textAlign: 'right' as const },
  svcCol3: { width: '15%' },
  svcCol4: { width: '15%', textAlign: 'right' as const },
  svcCol5: { width: '20%' },

  noteBox: {
    marginTop: 16,
    padding: 10,
    backgroundColor: WARM_WHITE,
    borderWidth: 0.5,
    borderColor: BORDER,
  },
  noteText: {
    fontSize: 8,
    color: STONE,
    marginBottom: 2,
  },

  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7,
    color: STONE,
  },
});

function fmt(value: number | unknown): string {
  const num = Number(value);
  return `$${num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export interface RateSheetData {
  tiers: Array<{
    tierName: string;
    description: string | null;
    hallBaseRate: unknown;
    hallHourlyRate: unknown;
    eventSupportBase: unknown;
    eventSupportHourly: unknown;
    securityDeposit: unknown;
  }>;
  funeralTiers: Array<{
    tierName: string;
    attendeeRange: string;
    rate: unknown;
    securityDeposit: unknown;
  }>;
  equipmentCategories: Array<{
    name: string;
    items: Array<{
      name: string;
      description: string | null;
      ratePerEvent: unknown;
    }>;
  }>;
  serviceRates: Array<{
    roleName: string;
    ratePerHour: unknown;
    rateType: string;
    commissionPct: unknown;
    minHours: number;
    notes: string | null;
  }>;
}

export function RateSheetDocument({ data }: { data: RateSheetData }) {
  const currentYear = new Date().getFullYear();

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.orgName}>Shoboji Social Hall</Text>
          <Text style={s.subtitle}>Rates & Pricing</Text>
          <Text style={s.address}>
            Nu&#39;uanu, Honolulu, HI | Managed by Horiuchi Pacific Development Group
          </Text>
        </View>

        <View style={s.divider} />

        {/* Membership Tiers */}
        <Text style={s.sectionTitle}>Hall Rental Rates by Membership Tier</Text>
        <Text style={s.sectionNote}>
          All base rates include 4 hours. Additional hours billed at the hourly rate.
        </Text>

        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderCell, s.tierCol1]}>Tier</Text>
          <Text style={[s.tableHeaderCell, s.tierCol2]}>4-Hr Base</Text>
          <Text style={[s.tableHeaderCell, s.tierCol3]}>Hourly OT</Text>
          <Text style={[s.tableHeaderCell, s.tierCol4]}>Support Base</Text>
          <Text style={[s.tableHeaderCell, s.tierCol5]}>Support/Hr</Text>
          <Text style={[s.tableHeaderCell, s.tierCol6]}>Deposit</Text>
        </View>
        {data.tiers.map((tier, i) => (
          <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
            <View style={s.tierCol1}>
              <Text style={s.cellBold}>{tier.tierName}</Text>
              {tier.description && (
                <Text style={{ fontSize: 7, color: STONE }}>{tier.description}</Text>
              )}
            </View>
            <Text style={[s.cellRight, s.tierCol2]}>{fmt(tier.hallBaseRate)}</Text>
            <Text style={[s.cellRight, s.tierCol3]}>{fmt(tier.hallHourlyRate)}/hr</Text>
            <Text style={[s.cellRight, s.tierCol4]}>{fmt(tier.eventSupportBase)}</Text>
            <Text style={[s.cellRight, s.tierCol5]}>{fmt(tier.eventSupportHourly)}/hr</Text>
            <Text style={[s.cellRight, s.tierCol6]}>
              {Number(tier.securityDeposit) > 0 ? fmt(tier.securityDeposit) : 'Waived'}
            </Text>
          </View>
        ))}

        {/* Funeral Packages */}
        <Text style={s.sectionTitle}>After-Funeral Reception Packages</Text>
        <Text style={s.sectionNote}>
          Flat-rate packages include hall rental, basic setup, kitchen access, and event support for 4 hours.
        </Text>

        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderCell, s.funCol1]}>Tier</Text>
          <Text style={[s.tableHeaderCell, s.funCol2]}>Attendance</Text>
          <Text style={[s.tableHeaderCell, s.funCol3]}>Package Rate</Text>
          <Text style={[s.tableHeaderCell, s.funCol4]}>Deposit</Text>
        </View>
        {data.funeralTiers.map((ft, i) => (
          <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
            <Text style={[s.cellBold, s.funCol1]}>{ft.tierName}</Text>
            <Text style={[s.cell, s.funCol2]}>{ft.attendeeRange} guests</Text>
            <Text style={[s.cellRight, s.funCol3]}>{fmt(ft.rate)}</Text>
            <Text style={[s.cellRight, s.funCol4]}>
              {Number(ft.securityDeposit) > 0 ? fmt(ft.securityDeposit) : 'Waived'}
            </Text>
          </View>
        ))}

        {/* Equipment */}
        {data.equipmentCategories.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Equipment Rates</Text>
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderCell, s.eqCol1]}>Item</Text>
              <Text style={[s.tableHeaderCell, s.eqCol2]}>Category</Text>
              <Text style={[s.tableHeaderCell, s.eqCol3]}>Rate / Event</Text>
            </View>
            {data.equipmentCategories.flatMap((cat) =>
              cat.items.map((item, i) => (
                <View
                  key={`${cat.name}-${i}`}
                  style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}
                >
                  <View style={s.eqCol1}>
                    <Text style={s.cellBold}>{item.name}</Text>
                    {item.description && (
                      <Text style={{ fontSize: 7, color: STONE }}>{item.description}</Text>
                    )}
                  </View>
                  <Text style={[s.cell, s.eqCol2]}>{cat.name}</Text>
                  <Text style={[s.cellRight, s.eqCol3]}>{fmt(item.ratePerEvent)}</Text>
                </View>
              ))
            )}
          </>
        )}

        {/* Service Personnel */}
        {data.serviceRates.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Service Personnel Rates</Text>
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderCell, s.svcCol1]}>Role</Text>
              <Text style={[s.tableHeaderCell, s.svcCol2]}>Rate</Text>
              <Text style={[s.tableHeaderCell, s.svcCol3]}>Type</Text>
              <Text style={[s.tableHeaderCell, s.svcCol4]}>Min Hrs</Text>
              <Text style={[s.tableHeaderCell, s.svcCol5]}>Notes</Text>
            </View>
            {data.serviceRates.map((svc, i) => (
              <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                <Text style={[s.cellBold, s.svcCol1]}>{svc.roleName}</Text>
                <Text style={[s.cellRight, s.svcCol2]}>
                  {svc.rateType === 'commission'
                    ? `${Number(svc.commissionPct)}%`
                    : svc.ratePerHour
                      ? `${fmt(svc.ratePerHour)}/hr`
                      : '--'}
                </Text>
                <Text style={[s.cell, s.svcCol3]}>{svc.rateType}</Text>
                <Text style={[s.cellRight, s.svcCol4]}>{svc.minHours}</Text>
                <Text style={[s.cell, s.svcCol5]}>{svc.notes || '--'}</Text>
              </View>
            ))}
          </>
        )}

        {/* Notes */}
        <View style={s.noteBox}>
          <Text style={s.noteText}>
            - All events serving alcohol require a licensed HPD security officer ($300/hr).
          </Text>
          <Text style={s.noteText}>
            - All events must conclude by 10:00 PM. Setup may not begin before 8:00 AM.
          </Text>
          <Text style={s.noteText}>
            - Members receive priority booking and reduced rates. Annual membership: $150.
          </Text>
          <Text style={s.noteText}>
            - Contact us for custom pricing on multi-day events or special arrangements.
          </Text>
        </View>

        {/* Footer */}
        <Text style={s.footer}>
          Rates effective {currentYear}. Contact us for custom pricing. |
          Shoboji Social Hall | (808) 537-9409 | info@shoboji.org
        </Text>
      </Page>
    </Document>
  );
}
