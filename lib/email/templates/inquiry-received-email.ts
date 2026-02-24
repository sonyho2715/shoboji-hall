const NAVY = '#1e3a5f';
const WARM_WHITE = '#faf9f7';
const STONE = '#78716c';

interface InquiryReceivedData {
  customerFirstName: string;
  bookingNumber: string;
  eventDate: string;
  eventType: string;
}

export function buildInquiryReceivedEmailHTML(data: InquiryReceivedData): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: ${WARM_WHITE}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${WARM_WHITE}; padding: 24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background-color: ${NAVY}; padding: 28px 32px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">Shoboji Social Hall</h1>
          <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">Inquiry Received</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding: 32px;">
          <p style="margin: 0 0 16px; color: #1c1917; font-size: 15px; line-height: 1.6;">
            Dear ${data.customerFirstName},
          </p>
          <p style="margin: 0 0 20px; color: #44403c; font-size: 14px; line-height: 1.6;">
            Thank you for your interest in Shoboji Social Hall! We have received your booking inquiry and
            our team is reviewing the details.
          </p>

          <!-- Reference Number -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${WARM_WHITE}; border-radius: 6px; padding: 16px; margin-bottom: 20px; text-align: center;">
            <tr><td>
              <p style="margin: 0 0 4px; font-size: 11px; font-weight: 600; color: ${NAVY}; text-transform: uppercase; letter-spacing: 0.5px;">Your Booking Reference</p>
              <p style="margin: 0; font-size: 22px; font-weight: 700; color: ${NAVY};">${data.bookingNumber}</p>
              <p style="margin: 8px 0 0; color: ${STONE}; font-size: 12px;">Please keep this number for your records</p>
            </td></tr>
          </table>

          <!-- Quick Summary -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-left: 3px solid ${NAVY}; padding-left: 16px; margin-bottom: 24px;">
            <tr><td>
              <p style="margin: 0 0 4px; color: ${STONE}; font-size: 12px;">Event Type: <span style="color: #1c1917;">${data.eventType}</span></p>
              <p style="margin: 0; color: ${STONE}; font-size: 12px;">Requested Date: <span style="color: #1c1917;">${data.eventDate}</span></p>
            </td></tr>
          </table>

          <!-- What Happens Next -->
          <h3 style="margin: 0 0 12px; color: ${NAVY}; font-size: 14px;">What Happens Next</h3>
          <ol style="margin: 0 0 24px; padding-left: 20px; color: #44403c; font-size: 13px; line-height: 2;">
            <li>Our team will review your inquiry and check availability.</li>
            <li>We will send you a detailed quote within 1-2 business days.</li>
            <li>Once you approve the quote, we will collect the security deposit to confirm your reservation.</li>
          </ol>

          <p style="margin: 0 0 20px; color: #44403c; font-size: 14px; line-height: 1.6;">
            If you have any questions in the meantime, feel free to call us at
            <strong>(808) 537-9409</strong> or reply to this email.
          </p>

          <p style="margin: 0; color: #44403c; font-size: 14px; line-height: 1.6;">
            Mahalo,<br>
            <strong>Shoboji Social Hall</strong>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background-color: ${WARM_WHITE}; padding: 20px 32px; text-align: center; border-top: 1px solid #e7e5e4;">
          <p style="margin: 0 0 4px; color: ${STONE}; font-size: 12px;">Soto Mission of Hawaii Shoboji</p>
          <p style="margin: 0 0 4px; color: ${STONE}; font-size: 12px;">1708 Nuuanu Avenue, Honolulu, HI 96817</p>
          <p style="margin: 0; color: ${STONE}; font-size: 12px;">(808) 537-9409 | info@shoboji.org</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildInquiryReceivedEmailText(data: InquiryReceivedData): string {
  return `Dear ${data.customerFirstName},

Thank you for your interest in Shoboji Social Hall! We have received your booking inquiry and our team is reviewing the details.

YOUR BOOKING REFERENCE: ${data.bookingNumber}
Please keep this number for your records.

Event Type: ${data.eventType}
Requested Date: ${data.eventDate}

WHAT HAPPENS NEXT
1. Our team will review your inquiry and check availability.
2. We will send you a detailed quote within 1-2 business days.
3. Once you approve the quote, we will collect the security deposit to confirm your reservation.

If you have any questions, call us at (808) 537-9409 or reply to this email.

Mahalo,
Shoboji Social Hall

---
Soto Mission of Hawaii Shoboji
1708 Nuuanu Avenue, Honolulu, HI 96817
(808) 537-9409 | info@shoboji.org`;
}
