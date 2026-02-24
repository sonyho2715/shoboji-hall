import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/admin/customers/[id]
 * Customer detail with booking history.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const customerId = parseInt(id, 10);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    const customer = await db.customer.findUnique({
      where: { id: customerId },
      include: {
        membershipTier: true,
        bookings: {
          orderBy: { eventDate: 'desc' },
          include: { membershipTier: true },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    console.error('Customer detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

const updateCustomerSchema = z.object({
  fullName: z.string().min(2).optional(),
  organization: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  mailingAddress: z.string().optional(),
  preferredContact: z.enum(['phone', 'text', 'email']).optional(),
  membershipTierId: z.number().int().positive().optional(),
  isMember: z.boolean().optional(),
  notes: z.string().optional(),
});

/**
 * PUT /api/admin/customers/[id]
 * Update customer information.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const customerId = parseInt(id, 10);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid customer ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validated = updateCustomerSchema.parse(body);

    const customer = await db.customer.update({
      where: { id: customerId },
      data: validated,
    });

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Customer update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}
