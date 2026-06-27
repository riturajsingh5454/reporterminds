import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategorySection } from "@/components/admin/forms/category-section";
import {
  createArticleCategory,
  deleteArticleCategory,
  createArchiveCategory,
  deleteArchiveCategory,
  createGalleryCategory,
  deleteGalleryCategory,
} from "@/server/actions/categories";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const [articleCategories, archiveCategories, galleryCategories] = await Promise.all([
    prisma.articleCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.archiveCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.galleryCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Categories</h1>
        <p className="text-muted-foreground text-sm">Organize content across the blog, archive, and gallery.</p>
      </div>

      <CategorySection
        title="Article Categories"
        items={articleCategories}
        createAction={createArticleCategory}
        deleteAction={deleteArticleCategory}
      />

      <CategorySection
        title="Archive Categories"
        items={archiveCategories.map((c) => ({ ...c, badge: c.section === "JOURNALISM" ? "Journalism" : "Legacy" }))}
        createAction={createArchiveCategory}
        deleteAction={deleteArchiveCategory}
        sectionOptions={[
          { value: "JOURNALISM", label: "Journalism Archive" },
          { value: "LEGACY_PRINT", label: "Legacy in Print" },
        ]}
      />

      <CategorySection
        title="Gallery Categories"
        items={galleryCategories}
        createAction={createGalleryCategory}
        deleteAction={deleteGalleryCategory}
      />
    </div>
  );
}
