"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { testimonialSchema } from "@/lib/validations/testimonial";
import type { ActionResult } from "@/server/actions/books";

function parseTestimonialForm(formData: FormData) {
  return testimonialSchema.safeParse({
    type: formData.get("type"),
    authorName: formData.get("authorName"),
    role: formData.get("role") || undefined,
    company: formData.get("company") || undefined,
    content: formData.get("content"),
    videoUrl: formData.get("videoUrl") || undefined,
    avatarUrl: formData.get("avatarUrl") || undefined,
    category: formData.get("category"),
    rating: formData.get("rating") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createTestimonial(formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseTestimonialForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  await prisma.testimonial.create({ data: parsed.data });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  return { success: true };
}

export async function updateTestimonial(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseTestimonialForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  await prisma.testimonial.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  return { success: true };
}

export async function bulkDeleteTestimonials(ids: string[]): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.testimonial.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  return { success: true };
}
