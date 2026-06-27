"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import type { ActionResult } from "@/server/actions/books";

function slugify(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// --- Article Categories ---

export async function createArticleCategory(formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { success: false, error: "Name is required" };

  await prisma.articleCategory.create({
    data: { name, slug: slugify(name), description: String(formData.get("description") ?? "") || undefined },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteArticleCategory(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.articleCategory.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  return { success: true };
}

// --- Archive Categories ---

export async function createArchiveCategory(formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const name = String(formData.get("name") ?? "").trim();
  const section = String(formData.get("section") ?? "JOURNALISM") as "JOURNALISM" | "LEGACY_PRINT";
  if (!name) return { success: false, error: "Name is required" };

  await prisma.archiveCategory.create({ data: { name, slug: slugify(name), section } });
  revalidatePath("/admin/categories");
  revalidatePath("/archive");
  revalidatePath("/legacy-in-print");
  return { success: true };
}

export async function deleteArchiveCategory(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.archiveCategory.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/archive");
  return { success: true };
}

// --- Gallery Categories ---

export async function createGalleryCategory(formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { success: false, error: "Name is required" };

  await prisma.galleryCategory.create({ data: { name, slug: slugify(name) } });
  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteGalleryCategory(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.galleryCategory.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  return { success: true };
}
