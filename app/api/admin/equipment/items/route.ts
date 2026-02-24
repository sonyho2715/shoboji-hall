import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const createItemSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(1, 'Item name is required'),
  description: z.string().nullable().optional(),
  ratePerEvent: z.number().min(0, 'Rate must be positive'),
  quantityAvailable: z.number().int().min(1, 'Quantity must be at least 1'),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    const items = await db.equipmentItem.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Equipment items list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = createItemSchema.parse(body);

    // Get max sort order in category
    const maxSort = await db.equipmentItem.findFirst({
      where: { categoryId: validated.categoryId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const item = await db.equipmentItem.create({
      data: {
        categoryId: validated.categoryId,
        name: validated.name,
        description: validated.description ?? null,
        ratePerEvent: validated.ratePerEvent,
        quantityAvailable: validated.quantityAvailable,
        isActive: validated.isActive,
        sortOrder: (maxSort?.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Equipment item create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
