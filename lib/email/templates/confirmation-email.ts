const NAVY = '#1e3a5f';
const WARM_WHITE = '#faf9f7';
const STONE = '#78716c';

interface ConfirmationEmailData {
  customerFirstName: string;
  bookingNumber: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventType: string;
  totalAttendees: number;
  grandTotal: number;
}

export function buildConfirmationEmailHTML(data: ConfirmationEmailData): string {
  const formattedTotal = `$${data.grandTotal.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

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
          <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">Booking Confirmation</p>
        </td></tr>

        <!-- Success Banner -->
        <tr><td style="background-color: #ecfdf5; padding: 16px 32px; text-align: center; border-bottom: 1px solid #a7f3d0;">
          <p style="margin: 0; color: #065f46; font-size: 15px; font-weight: 600;">Your booking is confirmed!</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding: 32px;">
          <p style="margin: 0 0 16px; color: #1c1917; font-size: 15px; line-height: 1.6;">
            Dear ${data.customerFirstName},
          </p>
          <p style="margin: 0 0 20px; color: #44403c; font-size: 14px; line-height: 1.6;">
            We have received your deposit and your booking at Shoboji Social Hall is now confirmed.
            We look forward to hosting your event!
          </p>

          <!-- Event Details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${WARM_WHITE}; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
            <tr><td>
              <p style="margin: 0 0 8px; font-size: 11px; font-weight: 600; color: ${NAVY}; text-transform: uppercase; letter-spacing: 0.5px;">Your Event Details</p>
              <table cellpadding="4" cellspacing="0">
                <tr>
                  <td style="color: ${STONE}; font-size: 13px; padding-right: 16px;">Booking #:</td>
                  <td style="color: #1c1917; font-size: 13px; font-weight: 600;">${data.bookingNumber}</td>
                </tr>
                <tr>
                  <td style="color: ${STONE}; font-size: 13px; padding-right: 16px;">Event Date:</td>
                  <td style="color: #1c1917; font-size: 13px;">${data.eventDate}</td>
                </tr>
                <tr>
                  <td style="color: ${STONE}; font-size: 13px; padding-right: 16px;">Time:</td>
                  <td style="color: #1c1917; font-size: 13px;">${data.eventStartTime} - ${data.eventEndTime}</td>
                </tr>
                <tr>
                  <td style="color: ${STONE}; font-size: 13px; padding-right: 16px;">Event Type:</td>
                  <td style="color: #1c1917; font-size: 13px;">${data.eventType}</td>
                </tr>
                <tr>
                  <td style="color: ${STONE}; font-size: 13px; padding-right: 16px;">Attendees:</td>
                  <td style="color: #1c1917; font-size: 13px;">${data.totalAttendees}</td>
                </tr>
                <tr>
                  <td style="color: ${STONE}; font-size: 13px; padding-right: 16px;">Total:</td>
                  <td style="color: #1c1917; font-size: 13px; font-weight: 600;">${formattedTotal}</td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Next Steps -->
          <h3 style="margin: 0 0 12px; color: ${NAVY}; font-size: 14px;">What to Expect</h3>
          <ul style="margin: 0 0 20px; padding-left: 20px; color: #44403c; font-size: 13px; line-height: 1.8;">
            <li>Our team will contact you 1-2 weeks before the event to finalize setup details.</li>
            <li>Setup may begin at your designated time on the day of the event (earliest 8:00 AM).</li>
            <li>An event support team member will be assigned to assist you on the day of your event.</li>
            <li>All events must conclude by 10:00 PM.</li>
          </ul>

          <p style="margin: 0 0 20px; color: #44403c; font-size: 14px; line-height: 1.6;">
            If you have any questions or need to make changes, please do not hesitate to contact us at
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

export function buildConfirmationEmailText(data: ConfirmationEmailData): string {
  return `Dear ${data.customerFirstName},

YOUR BOOKING IS CONFIRMED!

We have received your deposit and your booking at Shoboji Social Hall is now confirmed.

BOOKING DETAILS
Booking #: ${data.bookingNumber}
Event Date: ${data.eventDate}
Time: ${data.eventStartTime} - ${data.eventEndTime}
Event Type: ${data.eventType}
Attendees: ${data.totalAttendees}
Total: $${data.grandTotal.toFixed(2)}

WHAT TO EXPECT
- Our team will contact you 1-2 weeks before the event to finalize setup details.
- Setup may begin at your designated time on the day of the event (earliest 8:00 AM).
- An event support team member will be assigned to assist you.
- All events must conclude by 10:00 PM.

If you have any questions, contact us at (808) 537-9409 or reply to this email.

Mahalo,
Shoboji Social Hall

---
Soto Mission of Hawaii Shoboji
1708 Nuuanu Avenue, Honolulu, HI 96817
(808) 537-9409 | info@shoboji.org`;
}
