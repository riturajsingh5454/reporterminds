"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { galleryItemSchema } from "@/lib/validations/gallery";
import type { ActionResult } from "@/server/actions/books";

async function saveUploadedFile(file: File | null, existingUrl?: string): Promise<string> {
  if (!file || !(file instanceof File) || file.size === 0) {
    if (existingUrl) return existingUrl;
    throw new Error("No file uploaded or file is empty");
  }

  // Validate file size (max 2MB)
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  if (file.size > MAX_SIZE) {
    throw new Error("File size must not exceed 2MB");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate a unique filename
  const fileExtension = file.name.split(".").pop() || "jpg";
  const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = join(uploadDir, uniqueFilename);
  await writeFile(filePath, buffer);

  return `/uploads/${uniqueFilename}`;
}

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
  try {
    imageUrl = await saveUploadedFile(imageFile);
  } catch (err) {
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
