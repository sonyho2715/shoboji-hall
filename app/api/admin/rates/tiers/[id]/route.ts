import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const updateTierSchema = z.object({
  hallBaseRate: z.number().positive().optional(),
  hallHourlyRate: z.number().positive().optional(),
  eventSupportBase: z.number().min(0).optional(),
  eventSupportHourly: z.number().min(0).optional(),
  securityDeposit: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tierId = parseInt(id, 10);

    if (isNaN(tierId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tier ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validated = updateTierSchema.parse(body);

    console.log(`[Rates] Updating membership tier ${tierId}:`, validated);

    const tier = await db.membershipTier.update({
      where: { id: tierId },
      data: validated,
    });

    return NextResponse.json({ success: true, data: tier });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Tier update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tier' },
      { status: 500 }
    );
  }
}
