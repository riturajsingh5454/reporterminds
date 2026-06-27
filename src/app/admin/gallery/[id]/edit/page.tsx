import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GalleryForm } from "@/components/admin/forms/gallery-form";

export const metadata: Metadata = { title: "Edit Photo" };

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    prisma.gallery.findUnique({ where: { id } }),
    prisma.galleryCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!item) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">Edit Photo</h1>
        <p className="text-muted-foreground text-sm">{item.caption ?? item.id}</p>
      </div>
      <GalleryForm item={item} categories={categories} />
    </div>
  );
}
