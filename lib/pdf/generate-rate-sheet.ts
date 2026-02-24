import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { RateSheetDocument } from './RateSheetDocument';
import type { RateSheetData } from './RateSheetDocument';

export type { RateSheetData };

export async function generateRateSheetPDF(data: RateSheetData): Promise<Buffer> {
  const element = React.createElement(RateSheetDocument, { data });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);
  return Buffer.from(buffer);
}
