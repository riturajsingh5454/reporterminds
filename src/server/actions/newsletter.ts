"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { newsletterSchema } from "@/lib/validations/newsletter";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { ActionResult } from "@/server/actions/books";

export type NewsletterActionResult = { success: true } | { success: false; error: string };

export async function subscribeToNewsletter(formData: FormData): Promise<NewsletterActionResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    source: formData.get("source") ?? undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  await prisma.newsletter.upsert({
    where: { email: parsed.data.email },
    update: { status: "SUBSCRIBED" },
    create: { email: parsed.data.email, source: parsed.data.source },
  });

  return { success: true };
}

export async function deleteSubscriber(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.newsletter.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
  return { success: true };
}

export async function bulkDeleteSubscribers(ids: string[]): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.newsletter.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/newsletter");
  return { success: true };
}
