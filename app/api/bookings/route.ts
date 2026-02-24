import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@/app/generated/prisma/client';
import { createBookingSchema } from '@/lib/validations/booking';
import { generateBookingNumber } from '@/lib/booking-number';
import {
  calculateQuote,
  type MembershipTierRates,
} from '@/lib/pricing-engine';
import { sendInquiryReceivedEmail } from '@/lib/email/send-inquiry-received';
import { format } from 'date-fns';
import { z } from 'zod';

/**
 * GET /api/bookings
 * List bookings with optional status filter.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const bookings = await db.booking.findMany({
      where,
      include: {
        customer: true,
        membershipTier: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookings
 * Create a new booking with customer, equipment, and services.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createBookingSchema.parse(body);

    // Fetch membership tier
    const tier = await db.membershipTier.findUnique({
      where: { id: validated.membershipTierId },
    });

    if (!tier) {
      return NextResponse.json(
        { success: false, error: 'Membership tier not found' },
        { status: 404 }
      );
    }

    // Calculate event duration
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
    const totalAttendees = validated.adultCount + validated.childCount;

    // Build tier rates for pricing engine
    const membershipTierRates: MembershipTierRates = {
      hallBaseRate: Number(tier.hallBaseRate),
      hallHourlyRate: Number(tier.hallHourlyRate),
      eventSupportBase: Number(tier.eventSupportBase),
      eventSupportHourly: Number(tier.eventSupportHourly),
      securityDeposit: Number(tier.securityDeposit),
    };

    // Calculate quote
    const quote = calculateQuote({
      membershipTier: membershipTierRates,
      eventDurationHours,
      totalAttendees,
      isFuneralPackage: validated.bookingType === 'funeral_package',
      alcoholServed: validated.alcoholServed,
      equipmentItems: validated.equipmentItems.map((item) => ({
        quantity: item.quantity,
        unitRate: item.unitRate,
      })),
      serviceItems: validated.serviceItems.map((svc) => ({
        hours: svc.hours,
        rateApplied: svc.rateApplied,
        rateType: svc.rateType,
        commissionPct: svc.commissionPct,
      })),
    });

    // Generate booking number
    const bookingNumber = await generateBookingNumber();

    // Create customer and booking in a transaction
    const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // Find or create customer
      let customer = await tx.customer.findFirst({
        where: {
          fullName: validated.fullName,
          email: validated.email || undefined,
        },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            fullName: validated.fullName,
            organization: validated.organization,
            phone: validated.phone,
            email: validated.email,
            mailingAddress: validated.mailingAddress,
            preferredContact: validated.preferredContact,
            membershipTierId: validated.membershipTierId,
            isMember: validated.isMember,
          },
        });
      }

      // Create booking
      const booking = await tx.booking.create({
        data: {
          customerId: customer.id,
          bookingNumber,
          status: 'inquiry',
          eventType: validated.eventType,
          eventDescription: validated.eventDescription,
          eventDate: new Date(validated.eventDate),
          eventStartTime: new Date(`1970-01-01T${validated.eventStartTime}:00Z`),
          eventEndTime: new Date(`1970-01-01T${validated.eventEndTime}:00Z`),
          setupHours: validated.setupHours,
          breakdownHours: validated.breakdownHours,
          rehearsalDatetime: validated.rehearsalDatetime
            ? new Date(validated.rehearsalDatetime)
            : null,
          adultCount: validated.adultCount,
          childCount: validated.childCount,
          expectedVehicles: validated.expectedVehicles ?? 0,
          bookingType: validated.bookingType,
          roomSetup: validated.roomSetup,
          alcoholServed: validated.alcoholServed,
          barType: validated.barType,
          specialRequirements: validated.specialRequirements,
          additionalNotes: validated.additionalNotes,
          membershipTierId: validated.membershipTierId,
          isFuneralPackage: validated.bookingType === 'funeral_package',
          hallRentalTotal: quote.hallRentalTotal,
          eventSupportTotal: quote.eventSupportTotal,
          equipmentTotal: quote.equipmentTotal,
          servicesTotal: quote.servicesTotal,
          securityDeposit: quote.securityDeposit,
          grandTotal: quote.grandTotal,
          referralSource: validated.referralSource,
        },
      });

      // Create booking equipment line items
      if (validated.equipmentItems.length > 0) {
        await tx.bookingEquipment.createMany({
          data: validated.equipmentItems.map((item) => ({
            bookingId: booking.id,
            equipmentId: item.equipmentId,
            quantity: item.quantity,
            unitRate: item.unitRate,
            lineTotal: item.quantity * item.unitRate,
          })),
        });
      }

      // Create booking service line items
      if (validated.serviceItems.length > 0) {
        await tx.bookingService.createMany({
          data: validated.serviceItems.map((svc) => ({
            bookingId: booking.id,
            serviceId: svc.serviceId,
            hours: svc.hours,
            rateApplied: svc.rateApplied,
            lineTotal: svc.rateType === 'flat'
              ? svc.rateApplied
              : svc.rateType === 'commission' && svc.commissionPct
                ? quote.hallRentalTotal * (svc.commissionPct / 100)
                : svc.hours * svc.rateApplied,
          })),
        });
      }

      // Log booking creation in history
      await tx.bookingHistory.create({
        data: {
          bookingId: booking.id,
          action: 'created',
          details: {
            bookingNumber,
            status: 'inquiry',
            grandTotal: quote.grandTotal,
          },
          performedBy: 'system',
        },
      });

      return { booking, customer };
    });

    // Send inquiry-received auto-reply email (non-blocking, never crashes the app)
    if (result.customer.email) {
      try {
        await sendInquiryReceivedEmail({
          to: result.customer.email,
          customerFirstName: result.customer.fullName.split(' ')[0],
          bookingNumber: result.booking.bookingNumber,
          eventDate: format(new Date(validated.eventDate), 'MMMM d, yyyy'),
          eventType: validated.eventType || 'Event',
        });
      } catch (emailError) {
        console.error('Inquiry received email send failed:', emailError);
        // Don't throw - booking was created successfully
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          bookingId: result.booking.id,
          bookingNumber: result.booking.bookingNumber,
          customerId: result.customer.id,
          grandTotal: quote.grandTotal,
          quote,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Booking creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
