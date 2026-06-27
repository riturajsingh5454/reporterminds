"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { galleryItemSchema } from "@/lib/validations/gallery";
import type { ActionResult } from "@/server/actions/books";

function parseGalleryForm(formData: FormData) {
  return galleryItemSchema.safeParse({
    imageUrl: formData.get("imageUrl"),
    caption: formData.get("caption") || undefined,
    categoryId: formData.get("categoryId"),
    width: formData.get("width") || undefined,
    height: formData.get("height") || undefined,
    eventName: formData.get("eventName") || undefined,
    location: formData.get("location") || undefined,
    order: formData.get("order") || 0,
  });
}

export async function createGalleryItem(formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseGalleryForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  await prisma.gallery.create({ data: parsed.data });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function updateGalleryItem(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseGalleryForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  await prisma.gallery.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.gallery.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function bulkDeleteGalleryItems(ids: string[]): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.gallery.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}
