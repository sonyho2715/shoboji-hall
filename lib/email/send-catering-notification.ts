import { sendEmail } from './mailer';
import {
  buildCateringNotificationHTML,
  buildCateringNotificationText,
} from './templates/catering-notification-email';

interface CateringNotificationParams {
  bookingNumber: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventType: string;
  totalAttendees: number;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceStyle: string;
  cuisines: string[];
  dietary: string;
  menuNotes: string;
  dessertNeeded: boolean;
  beverages: string[];
  budgetRange: string;
}

export async function sendCateringNotification(
  params: CateringNotificationParams
): Promise<void> {
  const cateringEmail =
    process.env.CATERING_EMAIL ||
    process.env.ADMIN_EMAIL ||
    'catering@shoboji.org';

  try {
    await sendEmail({
      to: cateringEmail,
      subject: `New Catering Inquiry -- ${params.bookingNumber} -- ${params.eventDate}`,
      html: buildCateringNotificationHTML(params),
      text: buildCateringNotificationText(params),
    });

    console.log(
      `Catering notification sent to ${cateringEmail} for booking ${params.bookingNumber}`
    );
  } catch (error) {
    console.error(
      `Failed to send catering notification to ${cateringEmail} for booking ${params.bookingNumber}:`,
      error
    );
    // Never crash - log and continue
  }
}
