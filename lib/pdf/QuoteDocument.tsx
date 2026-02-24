import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer';
import type { QuoteData } from './generate-quote';

// ---- Colors ----
const NAVY = '#1e3a5f';
const STONE = '#78716c';
const WARM_WHITE = '#faf9f7';
const DARK_TEXT = '#1c1917';
const BORDER = '#d6d3d1';

// ---- Styles ----
const s = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: DARK_TEXT,
    backgroundColor: '#ffffff',
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerLeft: {},
  headerRight: {
    alignItems: 'flex-end',
  },
  orgName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 8,
    color: STONE,
    marginBottom: 1,
  },
  quoteTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 4,
  },
  quoteMeta: {
    fontSize: 8,
    color: STONE,
    marginBottom: 1,
  },

  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginBottom: 16,
  },

  // Two-column layout
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfCol: {
    width: '48%',
  },

  // Section labels
  sectionLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  fieldLabel: {
    fontSize: 8,
    color: STONE,
    width: 90,
  },
  fieldValue: {
    fontSize: 8,
    color: DARK_TEXT,
  },

  // Table
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: NAVY,
    padding: 6,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    backgroundColor: WARM_WHITE,
  },
  tableCell: {
    fontSize: 8,
    color: DARK_TEXT,
  },
  tableCellRight: {
    fontSize: 8,
    color: DARK_TEXT,
    textAlign: 'right',
  },
  // Column widths for line items
  colDesc: { width: '45%' },
  colQty: { width: '15%', textAlign: 'right' as const },
  colRate: { width: '20%', textAlign: 'right' as const },
  colTotal: { width: '20%', textAlign: 'right' as const },

  // Totals
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  totalsBox: {
    width: 220,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalLabel: {
    fontSize: 9,
    color: STONE,
  },
  totalValue: {
    fontSize: 9,
    color: DARK_TEXT,
  },
  totalDivider: {
    borderTopWidth: 1,
    borderTopColor: NAVY,
    marginTop: 4,
    paddingTop: 4,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
  },
  grandTotalValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
  },

  // Terms
  termsSection: {
    marginTop: 8,
    padding: 12,
    backgroundColor: WARM_WHITE,
    borderWidth: 0.5,
    borderColor: BORDER,
  },
  termsTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 6,
  },
  termItem: {
    fontSize: 7.5,
    color: STONE,
    marginBottom: 3,
    lineHeight: 1.4,
  },

  // Signatures
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  signatureBlock: {
    width: '44%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: DARK_TEXT,
    marginBottom: 4,
    height: 24,
  },
  signatureLabel: {
    fontSize: 8,
    color: STONE,
    marginBottom: 2,
  },
  dateLine: {
    borderBottomWidth: 1,
    borderBottomColor: DARK_TEXT,
    marginTop: 8,
    marginBottom: 4,
    height: 18,
    width: 120,
  },

  // Footer
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

function fmt(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function QuoteDocument({ data }: { data: QuoteData }) {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <Text style={s.orgName}>Shoboji Social Hall</Text>
            <Text style={s.headerSub}>Soto Mission of Hawaii</Text>
            <Text style={s.headerSub}>1708 Nuuanu Avenue</Text>
            <Text style={s.headerSub}>Honolulu, HI 96817</Text>
            <Text style={s.headerSub}>Phone: (808) 537-9409</Text>
            <Text style={s.headerSub}>Email: info@shoboji.org</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.quoteTitle}>QUOTE</Text>
            <Text style={s.quoteMeta}>Quote #: {data.bookingNumber}</Text>
            <Text style={s.quoteMeta}>Date Issued: {data.issueDate}</Text>
            <Text style={s.quoteMeta}>Valid Until: {data.validUntil}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* Bill To + Event Summary */}
        <View style={s.row}>
          <View style={s.halfCol}>
            <Text style={s.sectionLabel}>Bill To</Text>
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>
              {data.customer.fullName}
            </Text>
            {data.customer.organization && (
              <Text style={s.fieldValue}>{data.customer.organization}</Text>
            )}
            {data.customer.email && (
              <Text style={s.fieldValue}>{data.customer.email}</Text>
            )}
            {data.customer.phone && (
              <Text style={s.fieldValue}>{data.customer.phone}</Text>
            )}
          </View>
          <View style={s.halfCol}>
            <Text style={s.sectionLabel}>Event Summary</Text>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Date:</Text>
              <Text style={s.fieldValue}>{data.event.eventDate}</Text>
            </View>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Time:</Text>
              <Text style={s.fieldValue}>
                {data.event.startTime} - {data.event.endTime}
              </Text>
            </View>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Duration:</Text>
              <Text style={s.fieldValue}>{data.event.durationHours} hours</Text>
            </View>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Event Type:</Text>
              <Text style={s.fieldValue}>{data.event.eventType}</Text>
            </View>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Attendees:</Text>
              <Text style={s.fieldValue}>{data.event.totalAttendees}</Text>
            </View>
            {data.event.roomSetup && (
              <View style={s.fieldRow}>
                <Text style={s.fieldLabel}>Room Setup:</Text>
                <Text style={s.fieldValue}>{data.event.roomSetup}</Text>
              </View>
            )}
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Booking Type:</Text>
              <Text style={s.fieldValue}>
                {data.event.bookingType.replace(/_/g, ' ')}
              </Text>
            </View>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Rate Tier:</Text>
              <Text style={s.fieldValue}>{data.membershipTierName}</Text>
            </View>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, s.colDesc]}>Description</Text>
            <Text style={[s.tableHeaderCell, s.colQty]}>Qty / Hrs</Text>
            <Text style={[s.tableHeaderCell, s.colRate]}>Rate</Text>
            <Text style={[s.tableHeaderCell, s.colTotal]}>Total</Text>
          </View>
          {data.lineItems.map((item, i) => (
            <View
              key={i}
              style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}
            >
              <Text style={[s.tableCell, s.colDesc]}>{item.description}</Text>
              <Text style={[s.tableCellRight, s.colQty]}>
                {item.quantity > 0 ? `${item.quantity} ${item.unit}` : '--'}
              </Text>
              <Text style={[s.tableCellRight, s.colRate]}>
                {item.rate > 0 ? fmt(item.rate) : '--'}
              </Text>
              <Text style={[s.tableCellRight, s.colTotal]}>
                {fmt(item.total)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totalsContainer}>
          <View style={s.totalsBox}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Subtotal</Text>
              <Text style={s.totalValue}>{fmt(data.subtotal)}</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Security Deposit</Text>
              <Text style={s.totalValue}>{fmt(data.securityDeposit)}</Text>
            </View>
            <View style={[s.totalRow, s.totalDivider]}>
              <Text style={s.grandTotalLabel}>Grand Total</Text>
              <Text style={s.grandTotalValue}>{fmt(data.grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Terms & Conditions */}
        <View style={s.termsSection}>
          <Text style={s.termsTitle}>Terms & Conditions</Text>
          <Text style={s.termItem}>
            1. This quote is valid for 30 days from the date issued.
          </Text>
          <Text style={s.termItem}>
            2. A security deposit is required to confirm your reservation.
          </Text>
          <Text style={s.termItem}>
            3. All events must conclude by 10:00 PM. Setup may not begin before
            8:00 AM.
          </Text>
          <Text style={s.termItem}>
            4. A licensed security officer is required for all events serving
            alcohol.
          </Text>
          <Text style={s.termItem}>
            5. Cancellations must be made in writing at least 14 days prior to
            the event.
          </Text>
        </View>

        {/* Signature Lines */}
        <View style={s.signatureRow}>
          <View style={s.signatureBlock}>
            <View style={s.signatureLine} />
            <Text style={s.signatureLabel}>Customer Signature</Text>
            <View style={s.dateLine} />
            <Text style={s.signatureLabel}>Date</Text>
          </View>
          <View style={s.signatureBlock}>
            <View style={s.signatureLine} />
            <Text style={s.signatureLabel}>Authorized By</Text>
            <View style={s.dateLine} />
            <Text style={s.signatureLabel}>Date</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={s.footer}>
          Soto Mission of Hawaii Shoboji | Quote generated {data.issueDate}
        </Text>
      </Page>
    </Document>
  );
}
