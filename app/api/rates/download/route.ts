import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateRateSheetPDF, type RateSheetData } from '@/lib/pdf/generate-rate-sheet';

export async function GET() {
  try {
    const [tiers, funeralTiers, equipmentCategories, serviceRates] =
      await Promise.all([
        db.membershipTier.findMany({
          where: { isActive: true },
          orderBy: { id: 'asc' },
        }),
        db.funeralPackageTier.findMany({
          where: { isActive: true },
          orderBy: { id: 'asc' },
        }),
        db.equipmentCategory.findMany({
          orderBy: { sortOrder: 'asc' },
          include: {
            items: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        }),
        db.serviceRate.findMany({
          where: { isActive: true },
          orderBy: { id: 'asc' },
        }),
      ]);

    const data: RateSheetData = {
      tiers: tiers.map((t) => ({
        tierName: t.tierName,
        description: t.description,
        hallBaseRate: t.hallBaseRate,
        hallHourlyRate: t.hallHourlyRate,
        eventSupportBase: t.eventSupportBase,
        eventSupportHourly: t.eventSupportHourly,
        securityDeposit: t.securityDeposit,
      })),
      funeralTiers: funeralTiers.map((ft) => ({
        tierName: ft.tierName,
        attendeeRange: ft.attendeeRange,
        rate: ft.rate,
        securityDeposit: ft.securityDeposit,
      })),
      equipmentCategories: equipmentCategories
        .filter((c) => c.items.length > 0)
        .map((c) => ({
          name: c.name,
          items: c.items.map((item) => ({
            name: item.name,
            description: item.description,
            ratePerEvent: item.ratePerEvent,
          })),
        })),
      serviceRates: serviceRates.map((sr) => ({
        roleName: sr.roleName,
        ratePerHour: sr.ratePerHour,
        rateType: sr.rateType,
        commissionPct: sr.commissionPct,
        minHours: sr.minHours,
        notes: sr.notes,
      })),
    };

    const pdfBuffer = await generateRateSheetPDF(data);

    const year = new Date().getFullYear();
    const filename = `Shoboji-Social-Hall-Rates-${year}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error('Rate sheet generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate rate sheet' },
      { status: 500 }
    );
  }
}
