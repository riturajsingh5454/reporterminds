"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { galleryItemSchema } from "@/lib/validations/gallery";
import { saveUploadedFile } from "@/lib/upload";
import type { ActionResult } from "@/server/actions/books";


function parseGalleryForm(formData: FormData, imageUrl: string) {
  return galleryItemSchema.safeParse({
    imageUrl,
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

  const imageFile = formData.get("imageFile") as File | null;
  let imageUrl = "";
  console.log("1212121")
  try {
    imageUrl = await saveUploadedFile(imageFile);
    console.log("12122222")

  } catch (err) {
    console.log("13323f23f44")

    const message = err instanceof Error ? err.message : "Failed to upload image";
    return { success: false, error: message };
  }

  const parsed = parseGalleryForm(formData, imageUrl);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  await prisma.gallery.create({ data: parsed.data });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function updateGalleryItem(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");

  const existingItem = await prisma.gallery.findUnique({ where: { id } });
  if (!existingItem) return { success: false, error: "Photo not found" };

  const imageFile = formData.get("imageFile") as File | null;
  let imageUrl = existingItem.imageUrl;

  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await saveUploadedFile(imageFile);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload image";
      return { success: false, error: message };
    }
  }

  const parsed = parseGalleryForm(formData, imageUrl);
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
