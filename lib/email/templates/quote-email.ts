const NAVY = '#1e3a5f';
const WARM_WHITE = '#faf9f7';
const STONE = '#78716c';

interface QuoteEmailData {
  customerFirstName: string;
  bookingNumber: string;
  eventDate: string;
  eventType: string;
  totalAttendees: number;
  grandTotal: number;
  securityDeposit: number;
}

export function buildQuoteEmailHTML(data: QuoteEmailData): string {
  const formattedTotal = `$${data.grandTotal.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const formattedDeposit = `$${data.securityDeposit.toLocaleString('en-US', {
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
          <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">Your Event Quote</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding: 32px;">
          <p style="margin: 0 0 16px; color: #1c1917; font-size: 15px; line-height: 1.6;">
            Dear ${data.customerFirstName},
          </p>
          <p style="margin: 0 0 20px; color: #44403c; font-size: 14px; line-height: 1.6;">
            Thank you for your interest in hosting your event at Shoboji Social Hall.
            We are pleased to provide you with the following quote for your upcoming event.
          </p>

          <!-- Event Summary -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${WARM_WHITE}; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
            <tr><td>
              <p style="margin: 0 0 8px; font-size: 11px; font-weight: 600; color: ${NAVY}; text-transform: uppercase; letter-spacing: 0.5px;">Event Summary</p>
              <table cellpadding="4" cellspacing="0">
                <tr>
                  <td style="color: ${STONE}; font-size: 13px; padding-right: 16px;">Reference:</td>
                  <td style="color: #1c1917; font-size: 13px; font-weight: 600;">${data.bookingNumber}</td>
                </tr>
                <tr>
                  <td style="color: ${STONE}; font-size: 13px; padding-right: 16px;">Event Date:</td>
                  <td style="color: #1c1917; font-size: 13px;">${data.eventDate}</td>
                </tr>
                <tr>
                  <td style="color: ${STONE}; font-size: 13px; padding-right: 16px;">Event Type:</td>
                  <td style="color: #1c1917; font-size: 13px;">${data.eventType}</td>
                </tr>
                <tr>
                  <td style="color: ${STONE}; font-size: 13px; padding-right: 16px;">Attendees:</td>
                  <td style="color: #1c1917; font-size: 13px;">${data.totalAttendees}</td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Grand Total -->
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e7e5e4; border-bottom: 1px solid #e7e5e4; margin-bottom: 20px;">
            <p style="margin: 0 0 4px; font-size: 12px; color: ${STONE}; text-transform: uppercase; letter-spacing: 0.5px;">Grand Total</p>
            <p style="margin: 0; font-size: 32px; font-weight: 700; color: ${NAVY};">${formattedTotal}</p>
          </div>

          <!-- Deposit Note -->
          <div style="background-color: #fef3c7; border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 0 6px 6px 0; margin-bottom: 20px;">
            <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
              <strong>Security Deposit: ${formattedDeposit}</strong><br>
              A security deposit is required to confirm your reservation. Please see the attached quote for full details.
            </p>
          </div>

          <!-- CTA -->
          <p style="margin: 0 0 8px; color: #44403c; font-size: 14px; line-height: 1.6;">
            To confirm your booking, please contact us at <strong>(808) 537-9409</strong> or reply to this email.
          </p>
          <p style="margin: 0 0 20px; color: #44403c; font-size: 14px; line-height: 1.6;">
            A detailed PDF quote is attached to this email for your records.
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

export function buildQuoteEmailText(data: QuoteEmailData): string {
  const formattedTotal = `$${data.grandTotal.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return `Dear ${data.customerFirstName},

Thank you for your interest in hosting your event at Shoboji Social Hall. We are pleased to provide you with the following quote for your upcoming event.

EVENT SUMMARY
Reference: ${data.bookingNumber}
Event Date: ${data.eventDate}
Event Type: ${data.eventType}
Attendees: ${data.totalAttendees}

GRAND TOTAL: ${formattedTotal}

Security Deposit: $${data.securityDeposit.toFixed(2)}
A security deposit is required to confirm your reservation.

To confirm your booking, please contact us at (808) 537-9409 or reply to this email.

A detailed PDF quote is attached to this email.

Mahalo,
Shoboji Social Hall

---
Soto Mission of Hawaii Shoboji
1708 Nuuanu Avenue, Honolulu, HI 96817
(808) 537-9409 | info@shoboji.org`;
}
