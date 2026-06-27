"use server";

import { prisma } from "@/lib/prisma";
import { contactRequestSchema } from "@/lib/validations/contact";
import { sendMail } from "@/lib/mailer";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type ContactActionResult = { success: true } | { success: false; error: string };

export async function submitContactRequest(formData: FormData): Promise<ContactActionResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  const parsed = contactRequestSchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" };
  }

  await prisma.contactRequest.create({ data: parsed.data });

  const adminEmail = process.env.CONTACT_NOTIFICATION_EMAIL ?? process.env.EMAIL_FROM;
  if (adminEmail) {
    await sendMail({
      to: adminEmail,
      subject: `New ${parsed.data.type.replace("_", " ").toLowerCase()} inquiry from ${parsed.data.name}`,
      html: `<p><strong>From:</strong> ${parsed.data.name} (${parsed.data.email})</p><p><strong>Type:</strong> ${parsed.data.type}</p><p>${parsed.data.message}</p>`,
    });
  }

  return { success: true };
}
