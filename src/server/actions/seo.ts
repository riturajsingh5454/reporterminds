"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { seoSettingsSchema } from "@/lib/validations/seo";
import type { ActionResult } from "@/server/actions/books";

function parseSeoForm(formData: FormData) {
  return seoSettingsSchema.safeParse({
    path: formData.get("path"),
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
    ogImage: formData.get("ogImage") || undefined,
  });
}

export async function createSeoSetting(formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseSeoForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const existing = await prisma.sEOSettings.findUnique({ where: { path: parsed.data.path } });
  if (existing) return { success: false, error: "An entry for this path already exists." };

  await prisma.sEOSettings.create({ data: parsed.data });
  revalidatePath("/admin/seo");
  return { success: true };
}

export async function updateSeoSetting(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const parsed = parseSeoForm(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  await prisma.sEOSettings.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/seo");
  return { success: true };
}

export async function deleteSeoSetting(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.sEOSettings.delete({ where: { id } });
  revalidatePath("/admin/seo");
  return { success: true };
}
