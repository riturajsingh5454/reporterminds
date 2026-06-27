"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { archiveSchema, parseAttachmentsField } from "@/lib/validations/archive";
import type { ActionResult } from "@/server/actions/books";

function parseArchiveForm(formData: FormData) {
  return archiveSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content") || undefined,
    year: formData.get("year"),
    categoryId: formData.get("categoryId"),
    publication: formData.get("publication") || undefined,
    section: formData.get("section"),
    attachments: formData.get("attachments") || undefined,
    tags: formData.get("tags") || undefined,
    isFeatured: formData.get("isFeatured") === "on",
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
  });
}

export async function createArchiveItem(formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseArchiveForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { attachments, tags, ...rest } = parsed.data;
  await prisma.archive.create({
    data: {
      ...rest,
      attachments: parseAttachmentsField(attachments),
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    },
  });

  revalidatePath("/admin/archive");
  revalidatePath("/archive");
  revalidatePath("/legacy-in-print");
  return { success: true };
}

export async function updateArchiveItem(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseArchiveForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { attachments, tags, ...rest } = parsed.data;
  await prisma.archive.update({
    where: { id },
    data: {
      ...rest,
      attachments: parseAttachmentsField(attachments),
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    },
  });

  revalidatePath("/admin/archive");
  revalidatePath("/archive");
  revalidatePath("/legacy-in-print");
  return { success: true };
}

export async function deleteArchiveItem(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.archive.delete({ where: { id } });
  revalidatePath("/admin/archive");
  revalidatePath("/archive");
  return { success: true };
}

export async function bulkDeleteArchiveItems(ids: string[]): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.archive.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/archive");
  revalidatePath("/archive");
  return { success: true };
}
