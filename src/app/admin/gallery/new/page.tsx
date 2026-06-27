import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GalleryForm } from "@/components/admin/forms/gallery-form";

export const metadata: Metadata = { title: "Add Photo" };

export default async function NewGalleryItemPage() {
  const categories = await prisma.galleryCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl">Add Photo</h1>
        <p className="text-muted-foreground text-sm">Add a new photo to the gallery.</p>
      </div>
      <GalleryForm categories={categories} />
    </div>
  );
}
