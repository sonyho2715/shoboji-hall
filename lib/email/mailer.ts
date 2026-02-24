import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn(
      'SMTP credentials not configured. Email sending is disabled. Set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.'
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}): Promise<void> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(`Email not sent (SMTP not configured): ${options.subject} -> ${options.to}`);
    return;
  }

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@shoboji.org';

  await transporter.sendMail({
    from: `"Shoboji Social Hall" <${fromAddress}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.attachments,
  });
}
