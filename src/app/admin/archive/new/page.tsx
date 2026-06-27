import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArchiveForm } from "@/components/admin/forms/archive-form";

export const metadata: Metadata = { title: "New Archive Entry" };

export default async function NewArchivePage() {
  const categories = await prisma.archiveCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">New Archive Entry</h1>
        <p className="text-muted-foreground text-sm">Digitize a new clipping or report.</p>
      </div>
      <ArchiveForm categories={categories} />
    </div>
  );
}
