"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { userCreateSchema, userUpdateSchema } from "@/lib/validations/user";
import type { ActionResult } from "@/server/actions/books";

export async function createUser(formData: FormData): Promise<ActionResult> {
  await requireRole("SUPER_ADMIN");
  const parsed = userCreateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    bio: formData.get("bio") || undefined,
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { success: false, error: "A user with this email already exists." };

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const { password, ...rest } = parsed.data;
  void password;

  await prisma.user.create({ data: { ...rest, passwordHash } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUser(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole("SUPER_ADMIN");
  const parsed = userUpdateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") || "",
    role: formData.get("role"),
    bio: formData.get("bio") || undefined,
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { password, ...rest } = parsed.data;
  await prisma.user.update({
    where: { id },
    data: {
      ...rest,
      ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const session = await requireRole("SUPER_ADMIN");
  if (session.sub === id) return { success: false, error: "You cannot delete your own account." };
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  return { success: true };
}
