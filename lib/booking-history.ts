import { db } from '@/lib/db';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export async function logBookingAction(
  bookingId: number,
  action: string,
  details: Record<string, JsonValue>,
  performedBy: string
): Promise<void> {
  await db.bookingHistory.create({
    data: {
      bookingId,
      action,
      details,
      performedBy,
    },
  });
}
