import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { QuoteDocument } from './QuoteDocument';

export interface QuoteData {
  bookingNumber: string;
  issueDate: string;
  validUntil: string;
  customer: {
    fullName: string;
    organization?: string;
    email?: string;
    phone?: string;
  };
  event: {
    eventType: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    durationHours: number;
    totalAttendees: number;
    roomSetup?: string;
    bookingType: string;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    total: number;
  }>;
  subtotal: number;
  securityDeposit: number;
  grandTotal: number;
  alcoholServed: boolean;
  membershipTierName: string;
}

export async function generateQuotePDF(data: QuoteData): Promise<Buffer> {
  const element = React.createElement(QuoteDocument, { data });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);
  return Buffer.from(buffer);
}
