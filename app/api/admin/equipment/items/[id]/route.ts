import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const updateItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  ratePerEvent: z.number().min(0).optional(),
  quantityAvailable: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = parseInt(id, 10);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validated = updateItemSchema.parse(body);

    const item = await db.equipmentItem.update({
      where: { id: itemId },
      data: validated,
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Equipment item update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Soft-delete (deactivate) an equipment item.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = parseInt(id, 10);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const item = await db.equipmentItem.update({
      where: { id: itemId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Equipment item delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to deactivate item' },
      { status: 500 }
    );
  }
}
