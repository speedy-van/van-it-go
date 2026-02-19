import { Resend } from 'resend';

/** Lazy Resend client so build (no env) does not throw. Instantiated only when sending. */
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.trim() === '') return null;
  return new Resend(key);
}

const SUPPORT_EMAIL = 'support@speedy-van.co.uk';
const SUPPORT_PHONE = '01202 129746';
const COMPANY_NAME = 'Speedy Van';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResend();
  if (!resend) {
    throw new Error(
      'Email is not configured. Add RESEND_API_KEY to your environment (e.g. .env.local or Vercel).'
    );
  }
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'noreply@vanitgo.com',
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
}

export async function sendBookingConfirmedEmail(
  email: string,
  referenceNumber: string
) {
  return sendEmail({
    to: email,
    subject: 'Booking Confirmed - VanItGo',
    html: `<p>Your booking ${referenceNumber} has been confirmed. Track your move in real-time.</p><p>Contact us: ${SUPPORT_EMAIL} or ${SUPPORT_PHONE}</p>`,
  });
}

export type InvoiceEmailData = {
  referenceNumber: string;
  customerName: string;
  amount: string;
  serviceType: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledAt: string;
  paymentId: string;
};

export async function sendPaymentConfirmationWithInvoiceEmail(
  email: string,
  data: InvoiceEmailData
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const invoiceLink = `${baseUrl}/dashboard/bookings`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Payment confirmed</title></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #7B2FFF;">Payment confirmed – ${COMPANY_NAME}</h2>
  <p>Thank you for your payment. Your booking has been confirmed.</p>
  <p><strong>Booking reference:</strong> ${data.referenceNumber}</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
  <h3 style="font-size: 14px; color: #666;">INVOICE / RECEIPT</h3>
  <p><strong>Bill to:</strong><br/>${data.customerName}<br/>${email}</p>
  <p><strong>Service:</strong> ${data.serviceType}</p>
  <p><strong>Pickup:</strong> ${data.pickupAddress}</p>
  <p><strong>Dropoff:</strong> ${data.dropoffAddress}</p>
  <p><strong>Scheduled:</strong> ${data.scheduledAt}</p>
  <p><strong>Amount paid:</strong> £${data.amount}</p>
  <p><strong>Status:</strong> Paid</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
  <p style="font-size: 14px; color: #666;">You can view and track your booking here: <a href="${invoiceLink}">${invoiceLink}</a></p>
  <p style="font-size: 14px;">Questions? Contact us: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> or ${SUPPORT_PHONE}</p>
</body>
</html>`;

  return sendEmail({
    to: email,
    subject: `Payment received – Booking ${data.referenceNumber} – ${COMPANY_NAME}`,
    html,
  });
}

export async function sendBookingAcceptedByAdminEmail(
  email: string,
  referenceNumber: string
) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Booking confirmed by our team</title></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #7B2FFF;">Booking confirmed – ${COMPANY_NAME}</h2>
  <p>Good news! Your booking <strong>${referenceNumber}</strong> has been reviewed and confirmed by our team.</p>
  <p>We will assign a driver shortly and you will receive another email when your driver is assigned.</p>
  <p>Contact us: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> or ${SUPPORT_PHONE}</p>
</body>
</html>`;

  return sendEmail({
    to: email,
    subject: `Booking ${referenceNumber} confirmed by our team – ${COMPANY_NAME}`,
    html,
  });
}

export async function sendDriverAssignedEmail(
  email: string,
  driverName: string
) {
  return sendEmail({
    to: email,
    subject: 'Driver Assigned - VanItGo',
    html: `<p>${driverName} is your assigned driver for this move.</p><p>Contact: ${SUPPORT_EMAIL} or ${SUPPORT_PHONE}</p>`,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome</title></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #7B2FFF;">Welcome to ${COMPANY_NAME}</h2>
  <p>Hi ${name || 'there'},</p>
  <p>Your account has been created. You can now sign in and manage your bookings.</p>
  <p>Contact us: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> or ${SUPPORT_PHONE}</p>
</body>
</html>`;

  return sendEmail({
    to: email,
    subject: `Welcome to ${COMPANY_NAME}`,
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
  expiresInMinutes: number
) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reset your password</title></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #7B2FFF;">Reset your password – ${COMPANY_NAME}</h2>
  <p>We received a request to reset the password for your account.</p>
  <p><a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #7B2FFF; color: white; text-decoration: none; border-radius: 6px;">Reset password</a></p>
  <p>This link expires in ${expiresInMinutes} minutes. If you did not request this, you can ignore this email.</p>
  <p>Contact us: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> or ${SUPPORT_PHONE}</p>
</body>
</html>`;

  return sendEmail({
    to: email,
    subject: `Reset your password – ${COMPANY_NAME}`,
    html,
  });
}
