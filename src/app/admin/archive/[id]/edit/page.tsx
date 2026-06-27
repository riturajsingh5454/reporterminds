import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArchiveForm } from "@/components/admin/forms/archive-form";

export const metadata: Metadata = { title: "Edit Archive Entry" };

export default async function EditArchivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    prisma.archive.findUnique({ where: { id } }),
    prisma.archiveCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!item) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">Edit Archive Entry</h1>
        <p className="text-muted-foreground text-sm">{item.title}</p>
      </div>
      <ArchiveForm item={item} categories={categories} />
    </div>
  );
}
