interface CateringNotificationData {
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

function formatBudgetRange(range: string): string {
  const map: Record<string, string> = {
    under_2500: 'Under $2,500',
    '2500_5000': '$2,500 -- $5,000',
    '5000_10000': '$5,000 -- $10,000',
    '10000_plus': '$10,000+',
  };
  return map[range] || range;
}

function formatServiceStyle(style: string): string {
  const map: Record<string, string> = {
    buffet: 'Buffet',
    bento: 'Bento / Individual Portions',
    dropoff: 'Drop-Off / Delivery Only',
  };
  return map[style] || style;
}

function formatBeverages(beverages: string[]): string {
  const map: Record<string, string> = {
    water_tea: 'Water & Iced Tea',
    soft_drinks: 'Soft Drinks',
    coffee_tea: 'Coffee / Tea',
    full_service: 'Full Beverage Service',
  };
  return beverages.map((b) => map[b] || b).join(', ') || 'None requested';
}

function formatCuisines(cuisines: string[]): string {
  const map: Record<string, string> = {
    local: 'Local Plate Lunch',
    hawaiian: 'Hawaiian',
    japanese: 'Japanese',
    korean: 'Korean',
    american: 'American Comfort',
    fusion: 'Fusion',
    other: 'Other',
  };
  return cuisines.map((c) => map[c] || c).join(', ') || 'No preference specified';
}

export function buildCateringNotificationHTML(data: CateringNotificationData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Catering Inquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e7e5e4;">
      <!-- Header -->
      <div style="background-color:#1c1917;padding:24px 32px;">
        <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">
          New Catering Inquiry
        </h1>
        <p style="margin:8px 0 0;color:#a8a29e;font-size:14px;">
          From Shoboji Social Hall Booking System
        </p>
      </div>

      <!-- Body -->
      <div style="padding:32px;">
        <p style="margin:0 0 24px;color:#44403c;font-size:15px;line-height:1.6;">
          A new booking inquiry has been submitted that includes catering. Here are the details:
        </p>

        <!-- Booking Info -->
        <div style="background-color:#fafaf9;border-radius:8px;padding:20px;margin-bottom:20px;border:1px solid #e7e5e4;">
          <h2 style="margin:0 0 12px;color:#1c1917;font-size:16px;font-weight:600;">
            Booking Info
          </h2>
          <table style="width:100%;font-size:14px;color:#44403c;">
            <tr><td style="padding:4px 0;font-weight:500;">Booking #:</td><td style="padding:4px 0;">${data.bookingNumber}</td></tr>
            <tr><td style="padding:4px 0;font-weight:500;">Event Date:</td><td style="padding:4px 0;">${data.eventDate}</td></tr>
            <tr><td style="padding:4px 0;font-weight:500;">Time:</td><td style="padding:4px 0;">${data.eventStartTime} -- ${data.eventEndTime}</td></tr>
            <tr><td style="padding:4px 0;font-weight:500;">Event Type:</td><td style="padding:4px 0;">${data.eventType}</td></tr>
            <tr><td style="padding:4px 0;font-weight:500;">Attendees:</td><td style="padding:4px 0;">${data.totalAttendees}</td></tr>
            <tr><td style="padding:4px 0;font-weight:500;">Budget Range:</td><td style="padding:4px 0;">${formatBudgetRange(data.budgetRange)}</td></tr>
          </table>
        </div>

        <!-- Customer Info -->
        <div style="background-color:#fafaf9;border-radius:8px;padding:20px;margin-bottom:20px;border:1px solid #e7e5e4;">
          <h2 style="margin:0 0 12px;color:#1c1917;font-size:16px;font-weight:600;">
            Customer Contact
          </h2>
          <table style="width:100%;font-size:14px;color:#44403c;">
            <tr><td style="padding:4px 0;font-weight:500;">Name:</td><td style="padding:4px 0;">${data.customerName}</td></tr>
            ${data.customerPhone ? `<tr><td style="padding:4px 0;font-weight:500;">Phone:</td><td style="padding:4px 0;">${data.customerPhone}</td></tr>` : ''}
            ${data.customerEmail ? `<tr><td style="padding:4px 0;font-weight:500;">Email:</td><td style="padding:4px 0;">${data.customerEmail}</td></tr>` : ''}
          </table>
        </div>

        <!-- Catering Details -->
        <div style="background-color:#fffbeb;border-radius:8px;padding:20px;margin-bottom:20px;border:1px solid #fde68a;">
          <h2 style="margin:0 0 12px;color:#92400e;font-size:16px;font-weight:600;">
            Catering Preferences
          </h2>
          <table style="width:100%;font-size:14px;color:#44403c;">
            <tr><td style="padding:4px 0;font-weight:500;">Service Style:</td><td style="padding:4px 0;">${formatServiceStyle(data.serviceStyle)}</td></tr>
            <tr><td style="padding:4px 0;font-weight:500;">Cuisines:</td><td style="padding:4px 0;">${formatCuisines(data.cuisines)}</td></tr>
            <tr><td style="padding:4px 0;font-weight:500;">Dietary:</td><td style="padding:4px 0;">${data.dietary}</td></tr>
            <tr><td style="padding:4px 0;font-weight:500;">Menu Notes:</td><td style="padding:4px 0;">${data.menuNotes}</td></tr>
            <tr><td style="padding:4px 0;font-weight:500;">Dessert:</td><td style="padding:4px 0;">${data.dessertNeeded ? 'Yes' : 'No'}</td></tr>
            <tr><td style="padding:4px 0;font-weight:500;">Beverages:</td><td style="padding:4px 0;">${formatBeverages(data.beverages)}</td></tr>
          </table>
        </div>

        <p style="margin:24px 0 0;color:#78716c;font-size:13px;line-height:1.5;">
          Please follow up with the customer directly to provide a catering quote.
          You can reference booking number <strong>${data.bookingNumber}</strong> in all correspondence.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color:#fafaf9;padding:16px 32px;border-top:1px solid #e7e5e4;">
        <p style="margin:0;color:#a8a29e;font-size:12px;text-align:center;">
          Shoboji Social Hall Booking System
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function buildCateringNotificationText(data: CateringNotificationData): string {
  return `NEW CATERING INQUIRY - ${data.bookingNumber}

Booking Info:
- Booking #: ${data.bookingNumber}
- Event Date: ${data.eventDate}
- Time: ${data.eventStartTime} -- ${data.eventEndTime}
- Event Type: ${data.eventType}
- Attendees: ${data.totalAttendees}
- Budget Range: ${formatBudgetRange(data.budgetRange)}

Customer Contact:
- Name: ${data.customerName}
${data.customerPhone ? `- Phone: ${data.customerPhone}` : ''}
${data.customerEmail ? `- Email: ${data.customerEmail}` : ''}

Catering Preferences:
- Service Style: ${formatServiceStyle(data.serviceStyle)}
- Cuisines: ${formatCuisines(data.cuisines)}
- Dietary: ${data.dietary}
- Menu Notes: ${data.menuNotes}
- Dessert: ${data.dessertNeeded ? 'Yes' : 'No'}
- Beverages: ${formatBeverages(data.beverages)}

Please follow up with the customer directly to provide a catering quote.
Reference booking number ${data.bookingNumber} in all correspondence.

-- Shoboji Social Hall Booking System`;
}
