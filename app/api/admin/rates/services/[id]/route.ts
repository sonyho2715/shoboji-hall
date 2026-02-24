import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const updateServiceSchema = z.object({
  roleName: z.string().min(1).optional(),
  rateType: z.enum(['hourly', 'flat', 'commission', 'included']).optional(),
  ratePerHour: z.number().min(0).nullable().optional(),
  commissionPct: z.number().min(0).max(100).nullable().optional(),
  minHours: z.number().int().min(0).optional(),
  notes: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id, 10);

    if (isNaN(serviceId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid service ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validated = updateServiceSchema.parse(body);

    console.log(`[Rates] Updating service rate ${serviceId}:`, validated);

    const service = await db.serviceRate.update({
      where: { id: serviceId },
      data: validated,
    });

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Service rate update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service rate' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Soft-delete (deactivate) a service rate.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id, 10);

    if (isNaN(serviceId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid service ID' },
        { status: 400 }
      );
    }

    const service = await db.serviceRate.update({
      where: { id: serviceId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error('Service rate delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to deactivate service rate' },
      { status: 500 }
    );
  }
}
