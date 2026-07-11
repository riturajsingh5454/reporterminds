"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { bookSchema } from "@/lib/validations/book";
import { saveUploadedFile } from "@/lib/upload";

export type ActionResult = { success: true } | { success: false; error?: string };

async function handleBookImageUpload(formData: FormData, existingCoverImage?: string): Promise<{ coverImage: string; galleryImages: string[] } | { error: string }> {
  // Handle cover image upload
  const imageFile = formData.get("imageFile") as File | null;
  let coverImage = existingCoverImage ?? "";
  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    try {
      coverImage = await saveUploadedFile(imageFile);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Failed to upload cover image" };
    }
  }

  // Handle gallery image uploads
  const galleryFiles = formData.getAll("galleryFiles") as File[];
  const galleryImages: string[] = [];
  for (const file of galleryFiles) {
    if (file && file instanceof File && file.size > 0) {
      try {
        const url = await saveUploadedFile(file);
        galleryImages.push(url);
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to upload gallery image" };
      }
    }
  }

  return { coverImage, galleryImages };
}

function parseBookForm(formData: FormData, coverImage: string) {
  return bookSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    subtitle: formData.get("subtitle") || undefined,
    coverImage,
    description: formData.get("description"),
    isbn: formData.get("isbn") || undefined,
    publisher: formData.get("publisher") || undefined,
    publishedYear: formData.get("publishedYear") || undefined,
    language: formData.get("language") || undefined,
    pages: formData.get("pages") || undefined,
    price: formData.get("price") || undefined,
    category: formData.get("category") || undefined,
    amazonUrl: formData.get("amazonUrl") || undefined,
    flipkartUrl: formData.get("flipkartUrl") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    status: formData.get("status"),
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
  });
}

export async function createBook(formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");

  const uploadResult = await handleBookImageUpload(formData);
  if ("error" in uploadResult) return { success: false, error: uploadResult.error };

  const parsed = parseBookForm(formData, uploadResult.coverImage);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { amazonUrl, flipkartUrl, ...rest } = parsed.data;
  await prisma.book.create({
    data: {
      ...rest,
      coverImage: rest.coverImage ?? "",
      galleryImages: uploadResult.galleryImages,
      purchaseLinks: { amazon: amazonUrl, flipkart: flipkartUrl },
    },
  });

  revalidatePath("/admin/books");
  revalidatePath("/books");
  return { success: true };
}

export async function updateBook(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");

  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) return { success: false, error: "Book not found" };

  const uploadResult = await handleBookImageUpload(formData, existing.coverImage);
  if ("error" in uploadResult) return { success: false, error: uploadResult.error };

  // Merge new gallery images with existing if new ones are uploaded, otherwise keep existing
  const galleryImages = uploadResult.galleryImages.length > 0 ? uploadResult.galleryImages : existing.galleryImages;

  const parsed = parseBookForm(formData, uploadResult.coverImage);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { amazonUrl, flipkartUrl, ...rest } = parsed.data;
  await prisma.book.update({
    where: { id },
    data: {
      ...rest,
      coverImage: rest.coverImage ?? existing.coverImage,
      galleryImages,
      purchaseLinks: { amazon: amazonUrl, flipkart: flipkartUrl },
    },
  });

  revalidatePath("/admin/books");
  revalidatePath("/books");
  return { success: true };
}

export async function deleteBook(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.book.delete({ where: { id } });
  revalidatePath("/admin/books");
  revalidatePath("/books");
  return { success: true };
}

export async function bulkDeleteBooks(ids: string[]): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.book.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/books");
  revalidatePath("/books");
  return { success: true };
}
