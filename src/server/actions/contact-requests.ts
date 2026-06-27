"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import type { ActionResult } from "@/server/actions/books";

export async function updateContactRequestStatus(id: string, status: "NEW" | "IN_PROGRESS" | "RESOLVED"): Promise<ActionResult> {
  await requireRole("EDITOR");
  await prisma.contactRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function deleteContactRequest(id: string): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.contactRequest.delete({ where: { id } });
  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function bulkDeleteContactRequests(ids: string[]): Promise<ActionResult> {
  await requireRole("ADMIN");
  await prisma.contactRequest.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/contacts");
  return { success: true };
}
