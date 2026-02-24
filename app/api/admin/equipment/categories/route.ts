import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = await db.equipmentCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    const serialized = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      sortOrder: cat.sortOrder,
      items: cat.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        ratePerEvent: String(item.ratePerEvent),
        quantityAvailable: item.quantityAvailable,
        isActive: item.isActive,
        sortOrder: item.sortOrder,
      })),
    }));

    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    console.error('Equipment categories list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = createCategorySchema.parse(body);

    // Get max sort order
    const maxSort = await db.equipmentCategory.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const category = await db.equipmentCategory.create({
      data: {
        name,
        sortOrder: (maxSort?.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Equipment category create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
