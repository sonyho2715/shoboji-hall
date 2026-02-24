import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quoteCalculationSchema } from '@/lib/validations/booking';
import {
  calculateQuote,
  autoAddHPD,
  type MembershipTierRates,
} from '@/lib/pricing-engine';
import { z } from 'zod';

/**
 * POST /api/calculate/quote
 * Calculate a full quote breakdown based on event parameters.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = quoteCalculationSchema.parse(body);

    // Fetch membership tier from DB
    const tier = await db.membershipTier.findUnique({
      where: { id: validated.membershipTierId },
    });

    if (!tier) {
      return NextResponse.json(
        { success: false, error: 'Membership tier not found' },
        { status: 404 }
      );
    }

    // Calculate event duration in hours from start/end time
    const [startH, startM] = validated.eventStartTime.split(':').map(Number);
    const [endH, endM] = validated.eventEndTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (endMinutes <= startMinutes) {
      return NextResponse.json(
        { success: false, error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    const eventDurationHours = (endMinutes - startMinutes) / 60;

    // Build tier rates
    const membershipTier: MembershipTierRates = {
      hallBaseRate: Number(tier.hallBaseRate),
      hallHourlyRate: Number(tier.hallHourlyRate),
      eventSupportBase: Number(tier.eventSupportBase),
      eventSupportHourly: Number(tier.eventSupportHourly),
      securityDeposit: Number(tier.securityDeposit),
    };

    // Calculate quote
    const quote = calculateQuote({
      membershipTier,
      eventDurationHours,
      totalAttendees: validated.totalAttendees,
      isFuneralPackage: validated.isFuneralPackage,
      alcoholServed: validated.alcoholServed,
      equipmentItems: validated.equipmentItems,
    });

    // Include HPD info separately for transparency
    const hpdCost = autoAddHPD(validated.alcoholServed, eventDurationHours);

    return NextResponse.json({
      success: true,
      data: {
        ...quote,
        eventDurationHours,
        tierName: tier.tierName,
        hpdCost,
        hpdIncluded: validated.alcoholServed,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Quote calculation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate quote' },
      { status: 500 }
    );
  }
}
