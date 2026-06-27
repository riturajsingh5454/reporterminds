import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserForm } from "@/components/admin/forms/user-form";

export const metadata: Metadata = { title: "Edit User" };

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">Edit User</h1>
        <p className="text-muted-foreground text-sm">{user.name}</p>
      </div>
      <UserForm user={user} />
    </div>
  );
}
