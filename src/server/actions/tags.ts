"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import type { ActionResult } from "@/server/actions/books";

function slugify(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createTag(formData: FormData): Promise<ActionResult> {
  await requireRole("EDITOR");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { success: false, error: "Name is required" };

  await prisma.tag.create({ data: { name, slug: slugify(name) } });
  revalidatePath("/admin/tags");
  return { success: true };
}

export async function deleteTag(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/admin/tags");
  return { success: true };
}
