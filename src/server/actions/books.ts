"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { bookSchema } from "@/lib/validations/book";

export type ActionResult = { success: true } | { success: false; error?: string };

function parseBookForm(formData: FormData) {
  return bookSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    subtitle: formData.get("subtitle") || undefined,
    coverImage: formData.get("coverImage"),
    galleryImages: formData.get("galleryImages") || undefined,
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
  const parsed = parseBookForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { amazonUrl, flipkartUrl, galleryImages, ...rest } = parsed.data;
  await prisma.book.create({
    data: {
      ...rest,
      galleryImages: galleryImages ? galleryImages.split(",").map((s) => s.trim()).filter(Boolean) : [],
      purchaseLinks: { amazon: amazonUrl, flipkart: flipkartUrl },
    },
  });

  revalidatePath("/admin/books");
  revalidatePath("/books");
  return { success: true };
}

export async function updateBook(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseBookForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { amazonUrl, flipkartUrl, galleryImages, ...rest } = parsed.data;
  await prisma.book.update({
    where: { id },
    data: {
      ...rest,
      galleryImages: galleryImages ? galleryImages.split(",").map((s) => s.trim()).filter(Boolean) : [],
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
