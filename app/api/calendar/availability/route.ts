import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/calendar/availability?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Returns blocked/booked dates in the range.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { success: false, error: "startDate and endDate query params required" },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Get admin-blocked dates
    const blockedDates = await db.blockedDate.findMany({
      where: {
        blockedDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        blockedDate: true,
        reason: true,
      },
    });

    // Get dates with any non-cancelled bookings
    const bookedDates = await db.booking.findMany({
      where: {
        eventDate: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          notIn: ["cancelled"],
        },
      },
      select: {
        eventDate: true,
        status: true,
        bookingNumber: true,
        customer: { select: { fullName: true } },
        eventType: true,
      },
    });

    // Combine into unique dates
    const unavailableDates = new Set<string>();

    for (const bd of blockedDates) {
      unavailableDates.add(bd.blockedDate.toISOString().split("T")[0]);
    }

    for (const bk of bookedDates) {
      unavailableDates.add(bk.eventDate.toISOString().split("T")[0]);
    }

    return NextResponse.json({
      success: true,
      data: {
        unavailableDates: Array.from(unavailableDates).sort(),
        blockedDates: blockedDates.map((bd) => ({
          date: bd.blockedDate.toISOString().split("T")[0],
          reason: bd.reason,
        })),
        bookings: bookedDates.map((b) => ({
          date: b.eventDate.toISOString().split("T")[0],
          status: b.status,
          bookingNumber: b.bookingNumber,
          customerName: b.customer.fullName,
          eventType: b.eventType,
        })),
      },
    });
  } catch (error) {
    console.error("Availability fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
