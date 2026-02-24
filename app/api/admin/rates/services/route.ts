import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const createServiceSchema = z.object({
  roleName: z.string().min(1, 'Role name is required'),
  rateType: z.enum(['hourly', 'flat', 'commission', 'included']),
  ratePerHour: z.number().min(0).nullable().optional(),
  commissionPct: z.number().min(0).max(100).nullable().optional(),
  minHours: z.number().int().min(0).default(2),
  notes: z.string().nullable().optional(),
});

export async function GET() {
  try {
    const services = await db.serviceRate.findMany({
      orderBy: { id: 'asc' },
    });

    const serialized = services.map((sr) => ({
      id: sr.id,
      roleName: sr.roleName,
      ratePerHour: sr.ratePerHour ? String(sr.ratePerHour) : null,
      rateType: sr.rateType,
      commissionPct: sr.commissionPct ? String(sr.commissionPct) : null,
      minHours: sr.minHours,
      notes: sr.notes,
      isActive: sr.isActive,
    }));

    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    console.error('Service rates list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service rates' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = createServiceSchema.parse(body);

    console.log('[Rates] Creating new service rate:', validated);

    const service = await db.serviceRate.create({
      data: {
        roleName: validated.roleName,
        rateType: validated.rateType,
        ratePerHour: validated.ratePerHour ?? null,
        commissionPct: validated.commissionPct ?? null,
        minHours: validated.minHours,
        notes: validated.notes ?? null,
      },
    });

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Service rate create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service rate' },
      { status: 500 }
    );
  }
}
