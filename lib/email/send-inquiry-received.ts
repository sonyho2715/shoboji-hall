import { sendEmail } from './mailer';
import {
  buildInquiryReceivedEmailHTML,
  buildInquiryReceivedEmailText,
} from './templates/inquiry-received-email';

export async function sendInquiryReceivedEmail(params: {
  to: string;
  customerFirstName: string;
  bookingNumber: string;
  eventDate: string;
  eventType: string;
}): Promise<void> {
  const templateData = {
    customerFirstName: params.customerFirstName,
    bookingNumber: params.bookingNumber,
    eventDate: params.eventDate,
    eventType: params.eventType,
  };

  await sendEmail({
    to: params.to,
    subject: `Booking Inquiry Received - ${params.bookingNumber} | Shoboji Social Hall`,
    html: buildInquiryReceivedEmailHTML(templateData),
    text: buildInquiryReceivedEmailText(templateData),
  });
}
