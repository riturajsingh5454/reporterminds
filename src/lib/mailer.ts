import "server-only";
import nodemailer from "nodemailer";

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendMail(options: { to: string; subject: string; html: string }) {
  const transport = getTransport();
  if (!transport) {
    console.warn(`[mailer] SMTP not configured — skipping email to ${options.to}: "${options.subject}"`);
    return;
  }

  await transport.sendMail({
    from: process.env.EMAIL_FROM ?? "ReportersMind <no-reply@reportersmind.com>",
    ...options,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await sendMail({
    to,
    subject: "Reset your ReportersMind password",
    html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Click here to reset your password</a>. This link expires in 1 hour.</p><p>If you didn't request this, you can ignore this email.</p>`,
  });
}
